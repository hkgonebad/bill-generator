"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Container, Row, Col, Card, Tab, Nav, Table, Button, Badge, Modal, Alert, Form, InputGroup, Dropdown } from "react-bootstrap";
import Header from "@/components/Header";
import { FileText, Trash2, Edit, Download, Filter, Search, Eye, ArrowUp, ArrowDown, SlidersHorizontal, Copy } from "lucide-react";
import moment from "moment";

const BillTypeBadge = ({ type }: { type: string }) => {
  let color = "secondary";

  switch (type) {
    case "fuel":
      color = "success";
      break;
    case "rent":
      color = "info";
      break;
    default:
      color = "secondary";
  }

  return <Badge bg={color}>{type}</Badge>;
};

interface Bill {
  _id: string;
  name: string;
  billType: string;
  createdAt: string;
  updatedAt: string;
  // Fuel bill specific properties
  fsName?: string;
  fsRate?: number;
  fsTotal?: number;
  fsVolume?: number;
  // Rent receipt specific properties
  landlordName?: string;
  tenantName?: string;
  rentAmount?: number;
  periodStart?: string;
  periodEnd?: string;
}

interface BillsState {
  all: Bill[];
  fuel: Bill[];
  rent: Bill[];
}

export default function BillsClient() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bills, setBills] = useState<BillsState>({
    all: [],
    fuel: [],
    rent: [],
  });
  const [filteredBills, setFilteredBills] = useState<BillsState>({
    all: [],
    fuel: [],
    rent: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedBills, setSelectedBills] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showMultiDeleteModal, setShowMultiDeleteModal] = useState(false);
  const [dateFilter, setDateFilter] = useState<string | null>(null);

  useEffect(() => {
    // If the user is not authenticated, redirect to sign in
    if (status === "unauthenticated") {
      router.replace("/auth/signin");
    }

    // Fetch user's bills
    if (status === "authenticated") {
      fetchBills();
    }
  }, [status, router]);

  // Apply filters and sorting
  useEffect(() => {
    let filtered = { ...bills };

    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = {
        all: bills.all.filter(
          (bill) =>
            bill.name.toLowerCase().includes(search) ||
            (bill.billType === "fuel" && bill.fsName?.toLowerCase().includes(search)) ||
            (bill.billType === "rent" && (bill.landlordName?.toLowerCase().includes(search) || bill.tenantName?.toLowerCase().includes(search)))
        ),
        fuel: bills.fuel.filter((bill) => bill.name.toLowerCase().includes(search) || bill.fsName?.toLowerCase().includes(search)),
        rent: bills.rent.filter((bill) => bill.name.toLowerCase().includes(search) || bill.landlordName?.toLowerCase().includes(search) || bill.tenantName?.toLowerCase().includes(search)),
      };
    }

    // Apply date filter
    if (dateFilter) {
      const filterDate = moment(dateFilter).startOf("day");

      filtered = {
        all: filtered.all.filter((bill) => moment(bill.createdAt).isSame(filterDate, "day")),
        fuel: filtered.fuel.filter((bill) => moment(bill.createdAt).isSame(filterDate, "day")),
        rent: filtered.rent.filter((bill) => moment(bill.createdAt).isSame(filterDate, "day")),
      };
    }

    // Apply sorting
    const sortFn = (a: Bill, b: Bill) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    };

    filtered = {
      all: [...filtered.all].sort(sortFn),
      fuel: [...filtered.fuel].sort(sortFn),
      rent: [...filtered.rent].sort(sortFn),
    };

    setFilteredBills(filtered);
  }, [bills, searchTerm, sortOrder, dateFilter]);

  const fetchBills = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/bills");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch bills");
      }

      // Group bills by type
      const fuelBills = data.bills.filter((bill: Bill) => bill.billType === "fuel");
      const rentBills = data.bills.filter((bill: Bill) => bill.billType === "rent");

      const billsData = {
        all: data.bills,
        fuel: fuelBills,
        rent: rentBills,
      };

      setBills(billsData);
      setFilteredBills(billsData);
      setSelectedBills([]);
      setSelectAll(false);
    } catch (error) {
      console.error("Error fetching bills:", error);
      setError("Failed to load your bills. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (bill: Bill) => {
    const { billType, _id } = bill;
    if (billType === "fuel") {
      router.push(`/fuel-bill?edit=${_id}`);
    } else if (billType === "rent") {
      router.push(`/rent-receipt?edit=${_id}`);
    }
  };

  const handleView = (bill: Bill) => {
    setSelectedBill(bill);
    setShowViewModal(true);
  };

  const handleDelete = async () => {
    if (!selectedBill) return;

    try {
      const response = await fetch(`/api/bills/${selectedBill._id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to delete bill");
      }

      // Update the bills state
      setBills((prevBills) => {
        const updatedAll = prevBills.all.filter((b) => b._id !== selectedBill._id);
        const updatedFuel = prevBills.fuel.filter((b) => b._id !== selectedBill._id);
        const updatedRent = prevBills.rent.filter((b) => b._id !== selectedBill._id);

        return {
          all: updatedAll,
          fuel: updatedFuel,
          rent: updatedRent,
        };
      });

      setShowDeleteModal(false);
      setSelectedBill(null);
    } catch (error) {
      console.error("Error deleting bill:", error);
      setError("Failed to delete the bill. Please try again later.");
    }
  };

  const handleMultiDelete = async () => {
    if (selectedBills.length === 0) return;

    try {
      setIsLoading(true);

      // Delete each selected bill
      const deletePromises = selectedBills.map((id) => fetch(`/api/bills/${id}`, { method: "DELETE" }));

      await Promise.all(deletePromises);

      // Refresh bills list
      await fetchBills();
      setShowMultiDeleteModal(false);
    } catch (error) {
      console.error("Error deleting bills:", error);
      setError("Failed to delete some bills. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDuplicate = async (bill: Bill) => {
    // Remove _id to create a duplicate
    const { _id, createdAt, updatedAt, ...billData } = bill;

    try {
      const response = await fetch("/api/bills", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...billData,
          name: `${bill.name} (Copy)`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to duplicate bill");
      }

      // Refresh the bills list
      fetchBills();
    } catch (error) {
      console.error("Error duplicating bill:", error);
      setError("Failed to duplicate the bill. Please try again later.");
    }
  };

  const confirmDelete = (bill: Bill) => {
    setSelectedBill(bill);
    setShowDeleteModal(true);
  };

  const toggleBillSelection = (billId: string) => {
    setSelectedBills((prev) => {
      if (prev.includes(billId)) {
        return prev.filter((id) => id !== billId);
      } else {
        return [...prev, billId];
      }
    });
  };

  const toggleSelectAll = (tabKey: string) => {
    if (selectAll) {
      setSelectedBills([]);
    } else {
      const billsToSelect = filteredBills[tabKey as keyof BillsState].map((bill) => bill._id);
      setSelectedBills(billsToSelect);
    }
    setSelectAll(!selectAll);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setDateFilter(null);
    setSortOrder("desc");
  };

  if (status === "loading") {
    return (
      <>
        <Header title="My Bills" subtitle="View and manage your saved bills" icon={<FileText size={24} />} buttonText="Create New Bill" buttonLink="/dashboard" />
        <Container className="mt-5 text-center">
          <h3>Loading...</h3>
        </Container>
      </>
    );
  }

  if (status === "authenticated") {
    return (
      <>
        <Header title="My Bills" subtitle="View and manage your saved bills" icon={<FileText size={24} />} buttonText="Create New Bill" buttonLink="/dashboard" />
        <Container className="mt-4 mb-5">
          {error && <Alert variant="danger">{error}</Alert>}

          <Tab.Container defaultActiveKey="all">
            <Card className="shadow-sm">
              <Card.Header className="">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <Nav variant="tabs">
                    <Nav.Item>
                      <Nav.Link eventKey="all">All Bills</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="fuel">Fuel Bills</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="rent">Rent Receipts</Nav.Link>
                    </Nav.Item>
                  </Nav>

                  {selectedBills.length > 0 && (
                    <Button variant="danger" size="sm" onClick={() => setShowMultiDeleteModal(true)}>
                      <Trash2 size={16} className="me-1" />
                      Delete Selected ({selectedBills.length})
                    </Button>
                  )}
                </div>

                <div className="d-flex flex-wrap gap-2 align-items-center">
                  <InputGroup className="w-auto flex-grow-1">
                    <InputGroup.Text>
                      <Search size={16} />
                    </InputGroup.Text>
                    <Form.Control placeholder="Search bills..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                  </InputGroup>

                  <InputGroup className="w-auto">
                    <InputGroup.Text>
                      <Filter size={16} />
                    </InputGroup.Text>
                    <Form.Control type="date" value={dateFilter || ""} onChange={(e) => setDateFilter(e.target.value || null)} />
                  </InputGroup>

                  <Button variant="outline-secondary" onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
                    {sortOrder === "asc" ? <ArrowUp size={16} className="me-1" /> : <ArrowDown size={16} className="me-1" />}
                    {sortOrder === "asc" ? "Oldest First" : "Newest First"}
                  </Button>

                  {(searchTerm || dateFilter || sortOrder !== "desc") && (
                    <Button variant="outline-secondary" onClick={clearFilters}>
                      <Filter size={16} className="me-1" />
                      Clear Filters
                    </Button>
                  )}
                </div>
              </Card.Header>

              <Card.Body>
                <Tab.Content>
                  {["all", "fuel", "rent"].map((tabKey) => (
                    <Tab.Pane key={tabKey} eventKey={tabKey}>
                      {isLoading ? (
                        <div className="text-center p-4">
                          <p>Loading your bills...</p>
                        </div>
                      ) : filteredBills[tabKey as keyof BillsState].length === 0 ? (
                        <Alert variant="info">{searchTerm || dateFilter ? "No bills match your search criteria." : `No ${tabKey !== "all" ? tabKey : ""} bills found. Generate some bills to see them here.`}</Alert>
                      ) : (
                        <div className="table-responsive">
                          <Table hover className="align-middle">
                            <thead>
                              <tr>
                                <th style={{ width: "40px" }}>
                                  <Form.Check type="checkbox" checked={selectAll} onChange={() => toggleSelectAll(tabKey)} aria-label="Select all bills" />
                                </th>
                                <th>Name</th>
                                {tabKey === "all" && <th>Type</th>}
                                <th>Date</th>
                                <th>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredBills[tabKey as keyof BillsState].map((bill) => (
                                <tr key={bill._id}>
                                  <td>
                                    <Form.Check type="checkbox" checked={selectedBills.includes(bill._id)} onChange={() => toggleBillSelection(bill._id)} aria-label={`Select ${bill.name}`} />
                                  </td>
                                  <td>{bill.name}</td>
                                  {tabKey === "all" && (
                                    <td>
                                      <BillTypeBadge type={bill.billType} />
                                    </td>
                                  )}
                                  <td>{moment(bill.createdAt).format("MMM D, YYYY")}</td>
                                  <td>
                                    <div className="d-flex gap-1">
                                      <Button variant="outline-primary" size="sm" className="me-1" onClick={() => handleView(bill)}>
                                        <Eye size={14} />
                                      </Button>
                                      <Button variant="outline-secondary" size="sm" className="me-1" onClick={() => handleEdit(bill)}>
                                        <Edit size={14} />
                                      </Button>
                                      <Button variant="outline-success" size="sm" onClick={() => handleDuplicate(bill)} title="Duplicate">
                                        <Copy size={14} />
                                      </Button>
                                      <Button variant="outline-danger" size="sm" onClick={() => confirmDelete(bill)} title="Delete">
                                        <Trash2 size={14} />
                                      </Button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        </div>
                      )}
                    </Tab.Pane>
                  ))}
                </Tab.Content>
              </Card.Body>
            </Card>
          </Tab.Container>
        </Container>

        {/* Delete Confirmation Modal */}
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to delete &quot;{selectedBill?.name}&quot;?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Multiple Delete Confirmation Modal */}
        <Modal show={showMultiDeleteModal} onHide={() => setShowMultiDeleteModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Multiple Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to delete {selectedBills.length} selected bills? This action cannot be undone.</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowMultiDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleMultiDelete}>
              Delete Selected
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Bill View Modal */}
        <Modal
          show={showViewModal}
          onHide={() => {
            setShowViewModal(false);
            setSelectedBill(null);
          }}
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>{selectedBill?.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <p>
                  <strong>Type:</strong> {selectedBill?.billType === "fuel" ? "Fuel Bill" : "Rent Receipt"}
                </p>
                <p>
                  <strong>Created:</strong> {selectedBill && moment(selectedBill.createdAt).format("MMM D, YYYY, h:mm A")}
                </p>
                <p>
                  <strong>Last Updated:</strong> {selectedBill && moment(selectedBill.updatedAt).format("MMM D, YYYY, h:mm A")}
                </p>
              </Col>
              <Col md={6}>
                {selectedBill?.billType === "fuel" && (
                  <>
                    <p>
                      <strong>Fuel Station:</strong> {selectedBill.fsName}
                    </p>
                    <p>
                      <strong>Rate:</strong> ₹{selectedBill.fsRate?.toFixed(2)}
                    </p>
                    <p>
                      <strong>Total:</strong> ₹{selectedBill.fsTotal?.toFixed(2)}
                    </p>
                    <p>
                      <strong>Volume:</strong> {selectedBill.fsVolume?.toFixed(2)} liters
                    </p>
                  </>
                )}

                {selectedBill?.billType === "rent" && (
                  <>
                    <p>
                      <strong>Landlord:</strong> {selectedBill.landlordName}
                    </p>
                    <p>
                      <strong>Tenant:</strong> {selectedBill.tenantName}
                    </p>
                    <p>
                      <strong>Amount:</strong> ₹{selectedBill.rentAmount?.toFixed(2)}
                    </p>
                    <p>
                      <strong>Period:</strong> {moment(selectedBill.periodStart).format("MMM D, YYYY")} to {moment(selectedBill.periodEnd).format("MMM D, YYYY")}
                    </p>
                  </>
                )}
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => {
                setShowViewModal(false);
                setSelectedBill(null);
              }}
            >
              Close
            </Button>
            <Button variant="primary" onClick={() => handleEdit(selectedBill!)}>
              Edit
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                setShowViewModal(false);
                confirmDelete(selectedBill!);
              }}
            >
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }

  return null;
}
