import './AboutSite.css'; // Import the CSS file for styling
import PropTypes from "prop-types";

const AboutSite = ({ title, description, imageSrc }) => {
    return (
        <div className="aboutWebsite-container">
            <div className="aboutWebsite-text">
                <h2 className="aboutWebsite-heading-main">{title}</h2>
                <p className="aboutWebsite-paragraph">{description}</p>
            </div>
            <img src={imageSrc} alt={title} className="aboutWebsite-image" />
        </div>
    );
};

AboutSite.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    imageSrc: PropTypes.string.isRequired,
};

export default AboutSite;
