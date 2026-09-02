function ProjectCard({title, description, tech, github, demo}) {
    return(
        <div className="project-card">
            <h3>{title}</h3>
            <p>{description}</p>
            <div className="project-links">
                {github && <a href={github} target="_blank" rel="noopener noreferrer">GitHub</a>}
                {demo && <a href={demo} target="_blank" rel="noopener noreferrer">Live Demo</a>}
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