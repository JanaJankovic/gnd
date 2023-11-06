import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { SuggestionComponent } from './pages/suggestion/suggestion.component';
import { OutfitComponent } from './pages/outfit/outfit.component';
import { WardrobeComponent } from './pages/wardrobe/wardrobe.component';
import { UserComponent } from './pages/user/user.component';
import { AddWardrobeItemComponent } from './pages/add-wardrobe-item/add-wardrobe-item.component';
import { AddOutfitComponent } from './pages/add-outfit/add-outfit.component';
import { WeatherCardComponent } from './components/weather-card/weather-card.component';
import { OutfitCardComponent } from './components/outfit-card/outfit-card.component';
import { GalleryComponent } from './components/gallery/gallery.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { EventService } from './services/event.service';
import { NetworkService } from './services/network.service';
import { CategoryTabsComponent } from './components/category-tabs/category-tabs.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { StatDialogComponent } from './components/stat-dialog/stat-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSliderModule } from '@angular/material/slider';
import { EditWardrobeItemComponent } from './pages/edit-wardrobe-item/edit-wardrobe-item.component';
import { GalleryDialogComponent } from './components/gallery-dialog/gallery-dialog.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { LocationDialogComponent } from './components/location-dialog/location-dialog.component';
import { EvalComponent } from './pages/eval/eval.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    SuggestionComponent,
    OutfitComponent,
    WardrobeComponent,
    UserComponent,
    AddWardrobeItemComponent,
    AddOutfitComponent,
    WeatherCardComponent,
    OutfitCardComponent,
    GalleryComponent,
    CategoryTabsComponent,
    StatDialogComponent,
    EditWardrobeItemComponent,
    GalleryDialogComponent,
    LocationDialogComponent,
    EvalComponent,
  ],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgbModule,
    MatTooltipModule,
    HttpClientModule,
    MatGridListModule,
    ScrollingModule,
    MatDialogModule,
    MatSliderModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
  ],
  providers: [EventService, NetworkService],
  bootstrap: [AppComponent],
})
export class AppModule {}
