//create an array (contains Project 1, Project 2)
//map() is a Javascrip array method. (go through every item in this array and do something with it)
//project is just a variable representing the current object
// Whenever you see {something} it means "Evaluate this javascript expression and display the result."
//key={index} literally the index in the array, key is a react attribute used when rendering a list of elemnents.
import ProjectCard from "./ProjectCard"

function Projects(){
    
    // To add a new project, just add another object to this array.
    // github/demo are optional — leave them out (or "") to hide that link.
    const projects = [
        {
            title: "Job Search Copilot",
            description: "A full-stack job application tracker with AI features that parse job postings, score resume-to-posting fit using embeddings, and generate tailored resume/cover letter suggestions.",
            tech: ["React", "TypeScript", "Express", "PostgreSQL", "Claude API", "Voyager API"],
            github: "https://github.com/anth0n7/job-search-copilot",
            demo: "https://job-search-copilot-eta.vercel.app"
        }
        
    ]

    return (
        <section id="projects">
            <h2>Projects</h2>

            <div className="project-list">
            {projects.map((project,index) => (
                <ProjectCard
                    key={index}
                    title={project.title}
                    description={project.description}
                    tech={project.tech}
                    github={project.github}
                    demo={project.demo}
                />
            ))}
            </div>
        </section>
    )
}


export default Projects
