//create an array (contains Project 1, Project 2)
//map() is a Javascrip array method. (go through every item in this array and do something with it)
//project is just a variable representing the current object
// Whenever you see {something} it means "Evaluate this javascript expression and display the result."
//key={index} literally the index in the array, key is a react attribute used when rendering a list of elemnents.
import ProjectCard from "./ProjectCard"

function Projects(){
    
    const projects = [
        {
            title: "Portfolio Website",
            description: "My personal website built with React and Vite",
            tech: ["React", "Vite", "CSS"]
        },
        {
            title: "Todo App",
            description: "Simple task manager app",
            tech: ["JavaScript", "LocalStorage"]
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
                />
            ))}
            </div>
        </section>
    )
}


export default Projects
