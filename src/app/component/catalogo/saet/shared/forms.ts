import {FormMode} from "../QuestionsComponent";
import {Router} from "@angular/router";



export const handleMode = (idEvaluacion: number, url: string,
                           formMode:FormMode, nie:string,
                           router:Router
) => {
  if(formMode === FormMode.CREATE &&
    idEvaluacion !== 0
  ){
    router.navigate([url,nie,'view']);
  }
  if(formMode === FormMode.VIEW &&
    idEvaluacion === 0
  ){
    router.navigate([url,nie]);
  }
  if(formMode === FormMode.EDIT &&
    idEvaluacion === 0
  ){
    router.navigate([url,nie]);
  }
}
