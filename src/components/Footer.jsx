import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-solid-svg-icons'

const Footer = () => {
    return (
      <footer className="bg-dark text-white py-3 siteFooter">
        <div className="container">
          <p className="text-center mb-0">&copy; 2023 Bill Generator. Made with <FontAwesomeIcon icon={faHeart} fixedWidth  /> by Hk.</p> 
        </div>
      </footer>
    );
  };
 
export default Footer;