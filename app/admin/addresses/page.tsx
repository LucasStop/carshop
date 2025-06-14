'use client';

import { useState, useEffect } from 'react';
import { AdminService, AdminAddress } from '@/services/admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Eye, MapPin } from 'lucide-react';
import { usePermissions } from '@/hooks/use-permissions';
import { IconButton } from '@mui/material';

export default function AdminAddressesPage() {
  usePermissions();
  const [addresses, setAddresses] = useState<AdminAddress[]>([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
    from: 0,
    to: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [selectedAddress, setSelectedAddress] = useState<AdminAddress | null>(
    null
  );
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const brazilianStates = [
    'AC',
    'AL',
    'AP',
    'AM',
    'BA',
    'CE',
    'DF',
    'ES',
    'GO',
    'MA',
    'MT',
    'MS',
    'MG',
    'PA',
    'PB',
    'PR',
    'PE',
    'PI',
    'RJ',
    'RN',
    'RS',
    'RO',
    'RR',
    'SC',
    'SP',
    'SE',
    'TO',
  ];
  useEffect(() => {
    loadAddresses();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadAddresses();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, cityFilter, stateFilter, pagination.current_page]);

  const loadAddresses = async () => {
    try {
      setIsLoading(true);
      const response = await AdminService.getAddresses({
        page: pagination.current_page,
        per_page: pagination.per_page,
        search: searchTerm || undefined,
        city: cityFilter || undefined,
        state: stateFilter || undefined,
      });

      if (response && response.data) {
        setAddresses(response.data);
        setPagination({
          current_page: response.current_page,
          last_page: response.last_page,
          per_page: response.per_page,
          total: response.total,
          from: response.from,
          to: response.to,
        });
      }
    } catch (error) {
      console.error('Erro ao carregar endereços:', error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPagination(prev => ({ ...prev, current_page: 1 }));
  };

  const handleCityFilter = (city: string) => {
    setCityFilter(city);
    setPagination(prev => ({ ...prev, current_page: 1 }));
  };

  const handleStateFilter = (state: string) => {
    setStateFilter(state);
    setPagination(prev => ({ ...prev, current_page: 1 }));
  };

  const clearFilters = () => {
    setSearchTerm('');
    setCityFilter('');
    setStateFilter('');
    setPagination(prev => ({ ...prev, current_page: 1 }));
  };

  const handleView = (address: AdminAddress) => {
    setSelectedAddress(address);
    setIsViewDialogOpen(true);
  };

  if (isLoading && addresses.length === 0) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="h-6 w-32 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-48 animate-pulse rounded bg-gray-200" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-48 animate-pulse rounded bg-gray-200" />
                    <div className="h-3 w-32 animate-pulse rounded bg-gray-200" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Endereços</h1>
          <p className="mt-2 text-gray-600">
            Gerencie todos os endereços dos usuários do sistema
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>
            Use os filtros abaixo para encontrar endereços específicos
          </CardDescription>
        </CardHeader>{' '}
        <CardContent>
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                <Input
                  placeholder="Buscar por endereço, usuário..."
                  value={searchTerm}
                  onChange={e => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            {/*
            <div className="w-full sm:w-48">
              <Input
                placeholder="Filtrar por cidade"
                value={cityFilter}
                onChange={e => handleCityFilter(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-48">
              <Select value={stateFilter} onValueChange={handleStateFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os estados</SelectItem>{' '}
                  {brazilianStates.map(state => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              variant="outline"
              onClick={clearFilters}
              className="whitespace-nowrap"
            >
              Limpar Filtros
            </Button> */}
          </div>
        </CardContent>
      </Card>

      {/* Addresses Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Endereços ({pagination.total})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead>Endereço</TableHead>
                <TableHead>Cidade</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>CEP</TableHead>
                <TableHead className="text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    Carregando...
                  </TableCell>
                </TableRow>
              ) : addresses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    <div className="py-12 text-center">
                      <div className="text-gray-500">
                        <MapPin className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-4 text-lg font-medium">
                          Nenhum endereço encontrado
                        </h3>
                        <p className="mt-2">
                          {searchTerm || cityFilter || stateFilter
                            ? 'Tente ajustar os filtros de busca.'
                            : 'Não há endereços cadastrados no sistema.'}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                addresses.map(address => (
                  <TableRow key={address.id}>
                    <TableCell>{address.id}</TableCell>
                    <TableCell>
                      {address.user ? (
                        <div>
                          <div className="font-medium">{address.user.name}</div>
                          <div className="text-sm text-gray-500">
                            {address.user.email}
                          </div>
                        </div>
                      ) : (
                        'N/A'
                      )}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {address.address}, {address.number}
                        </div>
                        {address.complement && (
                          <div className="text-sm text-gray-500">
                            {address.complement}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{address.city}</TableCell>
                    <TableCell>{address.state}</TableCell>
                    <TableCell>{address.zip_code}</TableCell>
                    <TableCell className="text-center">
                      <IconButton
                        onClick={() => handleView(address)}
                        aria-label="Ver detalhes do endereço"
                        sx={{ color: 'black' }}
                      >
                        <Eye className="h-4 w-4" />
                      </IconButton>
                      {/* <IconButton
                        onClick={() => handleView(address)}
                        aria-label="Ver detalhes do endereço"
                      >
                        <Eye className="mr-2 h-4 w-4" />{' '}
                      </IconButton> */}
                      {/* <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleView(address)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver detalhes
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu> */}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {pagination.last_page > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Mostrando {pagination.from} a {pagination.to} de{' '}
                {pagination.total} endereços
              </div>
              <div className="flex space-x-2">
                {' '}
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.current_page === 1 || isLoading}
                  onClick={() =>
                    setPagination(prev => ({
                      ...prev,
                      current_page: prev.current_page - 1,
                    }))
                  }
                >
                  Anterior
                </Button>
                <span className="text-sm text-gray-500">
                  Página {pagination.current_page} de {pagination.last_page}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={
                    pagination.current_page === pagination.last_page ||
                    isLoading
                  }
                  onClick={() =>
                    setPagination(prev => ({
                      ...prev,
                      current_page: prev.current_page + 1,
                    }))
                  }
                >
                  Próximo
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Address Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Endereço</DialogTitle>
            <DialogDescription>
              Informações completas do endereço selecionado
            </DialogDescription>
          </DialogHeader>
          {selectedAddress && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <h3 className="mb-4 text-lg font-semibold">
                  Informações do Endereço
                </h3>
                <div className="space-y-2">
                  <div>
                    <strong>ID:</strong> {selectedAddress.id}
                  </div>
                  <div>
                    <strong>Endereço:</strong> {selectedAddress.address}
                  </div>
                  <div>
                    <strong>Número:</strong> {selectedAddress.number}
                  </div>
                  {selectedAddress.complement && (
                    <div>
                      <strong>Complemento:</strong> {selectedAddress.complement}
                    </div>
                  )}
                  <div>
                    <strong>Cidade:</strong> {selectedAddress.city}
                  </div>
                  <div>
                    <strong>Estado:</strong> {selectedAddress.state}
                  </div>
                  <div>
                    <strong>CEP:</strong> {selectedAddress.zip_code}
                  </div>
                </div>
              </div>
              <div>
                <h3 className="mb-4 text-lg font-semibold">
                  Informações do Usuário
                </h3>
                {selectedAddress.user ? (
                  <div className="space-y-2">
                    <div>
                      <strong>Nome:</strong> {selectedAddress.user.name}
                    </div>
                    <div>
                      <strong>Email:</strong> {selectedAddress.user.email}
                    </div>
                    <div>
                      <strong>Telefone:</strong> {selectedAddress.user.phone}
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-500">Usuário não encontrado</div>
                )}
              </div>
              <div className="md:col-span-2">
                <h3 className="mb-4 text-lg font-semibold">
                  Endereço Completo
                </h3>
                <div className="rounded-md bg-gray-50 p-4">
                  <div>
                    {selectedAddress.address}, {selectedAddress.number}
                    {selectedAddress.complement &&
                      `, ${selectedAddress.complement}`}
                  </div>
                  <div>
                    {selectedAddress.city} - {selectedAddress.state}
                  </div>
                  <div>CEP: {selectedAddress.zip_code}</div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
