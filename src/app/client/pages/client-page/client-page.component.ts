import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClientService } from '../../services/client.service';

@Component({
  imports: [],
  selector:'supplier-selector',
  templateUrl: './client-page.component.html',
  styleUrl: '../../../supplier/pages/supplier-page/supplier-page.component.css'
})
export class ClientPageComponent implements OnInit{
  #router = inject(Router);
  clientService = inject(ClientService);
  
  ngOnInit(): void {
    this.clientService.getClients().subscribe();
  }

  onRedirect(url: string) {
    this.#router.navigate([url])
  }

  onDelete(contacto: string) {
    this.clientService.deleteClient(contacto).subscribe()
  }

  onEdit(id: number) {
    this.#router.navigate(['/client/edit', id]);
  }
}
