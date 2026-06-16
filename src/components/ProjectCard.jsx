function ProjectCard({title, description, tech}) {
    return(
        <div className="project-card">
            <h3>{title}</h3>
            <p>{description}</p>
            <div className="project-links">
                <a href="#">GitHub</a>
                <a href="#">Live Demo</a>     
            </div>

            <div className="tech-stack">
                {tech.map((tool,index) => (
                   <span key={index}>{tool}</span>
                ))}
            </div>

           
        </div>

    
    )
}

export default ProjectCard