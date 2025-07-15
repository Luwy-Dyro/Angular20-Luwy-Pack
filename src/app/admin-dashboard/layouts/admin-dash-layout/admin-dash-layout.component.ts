import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';

@Component({
  selector: 'app-admin-dash-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-dash-layout.component.html',
})
export class AdminDashLayoutComponent { 

  authService = inject(AuthService)

  user = computed(() => this.authService.user() )


}
