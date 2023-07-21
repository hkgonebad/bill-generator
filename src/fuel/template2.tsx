import Image, { StaticImageData } from 'next/image';
import bankSideLogo from '../../src/assets/img/bank-side.png'

interface FuelTemplate2Props {
    logo: StaticImageData;
    fsName: string;
    fsRate: number;
    fsTotal: number;
    fsVolume: number;
    fsAddress: string;
    fsTel: string;
    fsDate: string;
    fsTime: string;
    csName: string;
    csTel: string;
    vehNumber: string;
    vehType: string;
    paymentType: string;
    invoiceNumber: string;
    selectedTaxOption : string;
    taxNumber: string;
}
  
const FuelTemplate2: React.FC<FuelTemplate2Props> = ({ logo, fsRate, fsName, fsTotal, fsVolume, fsAddress, fsTel, fsDate, fsTime, csName, csTel, vehNumber, vehType, paymentType, invoiceNumber, selectedTaxOption, taxNumber }) => {

    return(
        <>
            <div className="billWrap billWrap2">
                <div className="billBody">
                    <Image src={logo} alt="Bank Logo" className="billLogo"/>
                    <Image src={bankSideLogo} alt="Bank Logo" className="sideLogo"/>
                    <Image src={bankSideLogo} alt="Bank Logo" className="sideLogo sideLogoDown"/>

                    <p className="top">Welcomes You</p>

                    <div className="billTable">
                        <div className="billElement">
                            <p className="desc">{fsName}</p>
                        </div>
                        <div className="billElement">
                            <p className="desc">{fsAddress}</p>
                        </div>
                        <div className="billElement">
                            {fsTel !== '' && (
                                <p className="desc">Tel. No.: {fsTel}</p>
                            )}
                        </div>
                    </div>
                    
                    <div className="billTable">
                        <div className="billElement">
                            <p className="desc">Receipt No.: {invoiceNumber}</p>
                        </div>
                        <div className="billElement">
                            <p className="desc">Nozzle No.: 01</p>
                        </div>
                        <div className="billElement">
                            <p className="desc">Product: {vehType}</p>
                        </div>
                    </div>

                    <div className="billTable">
                        <div className="billElement">
                            <p className="desc">Preset Type: Amount</p>
                        </div>
                        <div className="billElement">
                            <p className="desc">Rate(Rs/L): {fsRate}</p>
                        </div>
                        <div className="billElement">
                            <p className="desc">Volume(L): {fsVolume}</p>
                        </div>
                        <div className="billElement">
                            <p className="desc">Amount(Rs): {fsTotal}</p>
                        </div>
                    </div>

                    <div className="billTable">
                        <div className="billElement">
                            <p className="desc">Vehicle No: {vehNumber}</p>
                        </div>
                        <div className="billElement">
                            <p className="desc">Mobile No: {csTel}</p>
                        </div>
                    </div>

                    <div className="billTable">
                        <div className="billElement">
                            <p className="desc">Date: {fsDate}</p>
                        </div>
                        <div className="billElement">
                            <p className="desc">Time: {fsTime}</p>
                        </div>
                    </div>
                    
                    <div className="billTable">
                        <div className="billElementFooter">
                            <p className="bottom">CST No: {taxNumber}</p>
                            <p className="bottom">LST No: </p>
                            <p className="bottom">VAT No: </p>
                            <p className="bottom">ATTENDANT ID: Not Available</p>
                            <p className="bottom">FCC DATE: Not Available</p>
                            <p className="bottom">FCC TIME: Not Available</p>
                        </div>

                        <div className="billElementFooter">
                            <p className="bottom">Thank You! Please Visit Again..</p>
                        </div>
                        
                    </div>
                    
                </div>
            </div>
        </>
    );
}

export default FuelTemplate2;