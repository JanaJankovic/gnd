import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { AddOutfitComponent } from './pages/add-outfit/add-outfit.component';
import { AddWardrobeItemComponent } from './pages/add-wardrobe-item/add-wardrobe-item.component';
import { OutfitComponent } from './pages/outfit/outfit.component';
import { SuggestionComponent } from './pages/suggestion/suggestion.component';
import { UserComponent } from './pages/user/user.component';
import { WardrobeComponent } from './pages/wardrobe/wardrobe.component';
import { EditWardrobeItemComponent } from './pages/edit-wardrobe-item/edit-wardrobe-item.component';
import { GalleryDialogComponent } from './components/gallery-dialog/gallery-dialog.component';
import { EvalComponent } from './pages/eval/eval.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'suggestions', component: SuggestionComponent },
  { path: 'outfits', component: OutfitComponent },
  { path: 'wardrobe', component: WardrobeComponent },
  { path: 'user', component: UserComponent },
  { path: 'outfits/add', component: AddOutfitComponent },
  { path: 'outfits/edit/:id', component: AddOutfitComponent },
  { path: 'wardrobe/add', component: AddWardrobeItemComponent },
  { path: 'wardrobe/edit/:id', component: EditWardrobeItemComponent },
  { path: 'gallery', component: GalleryDialogComponent },
  { path: 'eval', component: EvalComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
