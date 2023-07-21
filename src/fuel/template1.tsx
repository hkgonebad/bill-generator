import Image, { StaticImageData } from 'next/image';
import bankSideLogo from '../../src/assets/img/bank-side.png'

interface FuelTemplate1Props {
    logo: StaticImageData;
    fsName: string;
    fsRate: number;
    fsTotal: number;
    fsVolume: number;
    fsAddress: string;
    fsDate: string;
    fsTime: string;
    csName: string;
    vehNumber: string;
    vehType: string;
    paymentType: string;
    invoiceNumber: string;
    selectedTaxOption : string;
    taxNumber: string;
}
  
const FuelTemplate1: React.FC<FuelTemplate1Props> = ({ logo, fsRate, fsName, fsTotal, fsVolume, fsAddress, fsDate, fsTime, csName, vehNumber, vehType, paymentType, invoiceNumber, selectedTaxOption, taxNumber }) => {

    return(
        <>
            <div className="billWrap billWrap1">
                <div className="billBody">
                    <Image src={logo} alt="Bank Logo" className="billLogo"/>
                    <Image src={bankSideLogo} alt="Bank Logo" className="sideLogo"/>
                    <Image src={bankSideLogo} alt="Bank Logo" className="sideLogo sideLogoDown"/>

                    <p className="top">WELCOME!!!</p>
                    <p className="top desc">{fsName}</p>
                    {selectedTaxOption !== 'none' && (
                        <p className="top desc">{selectedTaxOption}: {taxNumber}</p>
                    )}
                    <p className="top">{fsAddress}</p>
                    <div className="billTable">
                        <div className="billElement">
                            <p className="desc">Receipt No.: {invoiceNumber}</p>
                        </div>
                    </div>
                    <div className="billTable">
                        <div className="billElement">
                            <p className="desc">PRODUCT: {vehType}</p>
                        </div>
                        <div className="billElement">
                            <p className="desc">RATE/LTR: ₹ {fsRate}</p>
                        </div>
                        <div className="billElement">
                            <p className="desc">AMOUNT: ₹ {fsTotal}</p>
                        </div>
                        <div className="billElement">
                            <p className="desc">VOLUME(LTR.): {fsVolume}lt</p>
                        </div>
                    </div>
                    <div className="billTable">
                        <div className="billElement">
                            <p className="desc">VEH TYPE: {vehType}</p>
                        </div>
                        <div className="billElement">
                            <p className="desc">VEH NO: {vehNumber}</p>
                        </div>
                        <div className="billElement">
                            <p className="desc">CUSTOMER NAME: {csName}</p>
                        </div>
                    </div>
                    <div className="billElement">
                        <p className="desc">Date: {fsDate}</p>
                        <p>Time: {fsTime}</p>
                    </div>
                    <div className="billElement">
                        <p className="desc">MODE: {paymentType}</p>
                    </div>
                    <p className="bottom">SAVE FUEL YAANI SAVE MONEY !! THANKS FOR FUELLING WITH US. YOU CAN NOW CALL US ON 1800 226344 (TOLL-FREE) FOR QUERIES/COMPLAINTS.</p>
                </div>
            </div>
        </>
    );
}

export default FuelTemplate1;