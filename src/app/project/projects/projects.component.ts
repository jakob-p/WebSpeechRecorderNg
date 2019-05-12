import {AfterContentChecked, AfterViewInit, Component, OnInit} from '@angular/core';
import {Project} from "../../../../projects/speechrecorderng/src/lib/speechrecorder/project/project";
import {ProjectService} from "../../../../projects/speechrecorderng/src/lib/speechrecorder/project/project.service";
import {ScriptService} from "../../../../projects/speechrecorderng/src/lib/speechrecorder/script/script.service";
import {Router} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {UniqueProjectNameValidator} from "./project.name.validator";


@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['../../../speechrecorder_mat.scss']
})
export class ProjectsComponent implements OnInit,AfterViewInit {

  private _projects:Array<Project>;
  displayedColumns: string[] = ['name','channels','action'];
  private newProject:Project= {name:''};

  projectForm:FormGroup;

  constructor(private router:Router,private projectService:ProjectService,private scriptService:ScriptService,private projectnameValidator:UniqueProjectNameValidator) {}

  ngOnInit() {

    this.projectForm = new FormGroup({
      'name': new FormControl(this.newProject.name,{
        validators:Validators.required,
        asyncValidators:this.projectnameValidator.validate.bind(this)
    }),
      'channels': new FormControl(this.newProjectChannels)

    });
  }

  ngAfterViewInit(): void {

    this.fetchProjects()
  }


  get nameField() { return this.projectForm.get('name'); }

  get projects(): Array<Project> {
    return this._projects;
  }

  newProjectChannels(){
    // default
    let chs=2;
    if (this.newProject && this.newProject.audioFormat){
      chs=this.newProject.audioFormat.channels
    }
    return chs;
  }

  channels(project:Project){
    // default
    let chs=2;
    if (project && project.audioFormat){
      chs=project.audioFormat.channels
    }
    return chs;
  }

  fetchProjects():void{
      this.projectService.projectsObservable().subscribe(prjs => {

        prjs.forEach((prj)=>{
          // prefetch scripts
          this.scriptService.projectScriptsObserver(prj.name).subscribe((v)=>{

          },(err)=>{
            //this._projects=prjs
          },()=>{
            //this._projects=prjs
            // auto select project if only one associated
            if(!this.projectService.selectedProject && this._projects.length==1){
              this.projectService.selectedProject=this._projects[0]
            }
          })
        })
        this._projects=prjs
      })
  }

  addNewProject(){
      this.newProject.name=this.nameField.value;
      this.projectService.projectAddObservable(this.newProject).subscribe((n)=>{

      },(err)=>{
          // TODO
      },()=>{
          this.projectForm.reset()
          this.fetchProjects()
      })
  }

  select(project:Project){
    this.projectService.selectedProject=project;
    this.router.navigate(['/wsp','project',this.projectService.selectedProject.name,'session'])
  }

}