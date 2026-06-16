import{FaGithub, FaLinkedin, FaEnvelope} from "react-icons/fa";

function Contact(){
    return(
        <section id="contact">
            <h2>Contact</h2>

            <div className="contact-links">
                <a href="https://github.com/anth0n7" target="_blank" rel="noopener noreferrer">
                    <FaGithub />
                </a>

                <a href="https://linkedin.com/in/anthony-thomas-16a618243" target="_blank" rel="noopener noreferrer">
                    <FaLinkedin />
                </a>

                <a href="mailto:aethomas1028@gmail.com">
                    <FaEnvelope />
                </a>
            </div>
      </section>
    )
}

export default Contact