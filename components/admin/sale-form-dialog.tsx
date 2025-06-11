'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Autocomplete,
  Box,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  AdminService,
  AdminSale,
  CreateSaleRequest,
  UpdateSaleRequest,
  AdminCar,
  AdminUser,
} from '@/services/admin';

const saleSchema = z.object({
  car_id: z.number().min(1, 'Selecione um veículo'),
  buyer_id: z.number().min(1, 'Selecione um comprador'),
  seller_id: z.number().min(1, 'Selecione um vendedor'),
  price: z.number().min(0, 'Preço deve ser maior que zero'),
  status: z.enum(['pending', 'completed', 'cancelled']).optional(),
  notes: z.string().optional(),
});

type SaleFormData = z.infer<typeof saleSchema>;

interface SaleFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  sale?: AdminSale | null;
}

export function SaleFormDialog({
  open,
  onClose,
  onSubmit,
  sale,
}: SaleFormDialogProps) {
  const [loading, setLoading] = useState(false);
  const [cars, setCars] = useState<AdminCar[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const isEditing = !!sale;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SaleFormData>({
    resolver: zodResolver(saleSchema),
    defaultValues: {
      car_id: 0,
      buyer_id: 0,
      seller_id: 0,
      price: 0,
      status: 'pending',
      notes: '',
    },
  });

  // Carregar dados necessários
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingData(true);

        // Carregar carros disponíveis (apenas ativos)
        const carsResponse = await AdminService.getCars({
          status: 'active',
          per_page: 100,
        });
        setCars(carsResponse.data);

        // Carregar usuários
        const usersResponse = await AdminService.getUsers({
          per_page: 100,
        });
        setUsers(usersResponse.data);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoadingData(false);
      }
    };

    if (open) {
      loadData();
    }
  }, [open]);

  // Preencher formulário quando editando
  useEffect(() => {
    if (sale && open) {
      reset({
        car_id: sale.car_id,
        buyer_id: sale.buyer_id,
        seller_id: sale.seller_id,
        price: sale.price,
        status: sale.status,
        notes: sale.notes || '',
      });
    } else if (!sale && open) {
      reset({
        car_id: 0,
        buyer_id: 0,
        seller_id: 0,
        price: 0,
        status: 'pending',
        notes: '',
      });
    }
  }, [sale, open, reset]);

  const onFormSubmit = async (data: SaleFormData) => {
    try {
      setLoading(true);

      if (isEditing && sale) {
        const updateData: UpdateSaleRequest = {
          price: data.price,
          status: data.status,
          notes: data.notes,
        };
        await AdminService.updateSale(sale.id, updateData);
      } else {
        const createData: CreateSaleRequest = {
          car_id: data.car_id,
          buyer_id: data.buyer_id,
          seller_id: data.seller_id,
          price: data.price,
          notes: data.notes,
        };
        await AdminService.createSale(createData);
      }

      onSubmit();
    } catch (error) {
      console.error('Erro ao salvar venda:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      reset();
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>{isEditing ? 'Editar Venda' : 'Nova Venda'}</DialogTitle>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <DialogContent>
          {loadingData ? (
            <Box p={3} textAlign="center">
              <Typography>Carregando dados...</Typography>
            </Box>
          ) : (
            <Grid container spacing={2}>
              {/* Veículo */}
              <Grid item xs={12}>
                <Controller
                  name="car_id"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      options={cars}
                      getOptionLabel={option =>
                        typeof option === 'object'
                          ? `${option.brand?.name} ${option.model?.name} ${option.year} - R$ ${option.price.toLocaleString('pt-BR')}`
                          : ''
                      }
                      value={cars.find(car => car.id === field.value) || null}
                      onChange={(_, value) => field.onChange(value?.id || 0)}
                      disabled={isEditing} // Não permitir alterar veículo ao editar
                      renderInput={params => (
                        <TextField
                          {...params}
                          label="Veículo"
                          required
                          error={!!errors.car_id}
                          helperText={errors.car_id?.message}
                        />
                      )}
                      renderOption={(props, option) => (
                        <Box component="li" {...props}>
                          <Box>
                            <Typography variant="body1">
                              {option.brand?.name} {option.model?.name}{' '}
                              {option.year}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {option.color} - R${' '}
                              {option.price.toLocaleString('pt-BR')}
                            </Typography>
                          </Box>
                        </Box>
                      )}
                    />
                  )}
                />
              </Grid>

              {/* Comprador */}
              <Grid item xs={12} md={6}>
                <Controller
                  name="buyer_id"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      options={users}
                      getOptionLabel={option =>
                        typeof option === 'object'
                          ? `${option.name} (${option.email})`
                          : ''
                      }
                      value={
                        users.find(user => user.id === field.value) || null
                      }
                      onChange={(_, value) => field.onChange(value?.id || 0)}
                      disabled={isEditing} // Não permitir alterar comprador ao editar
                      renderInput={params => (
                        <TextField
                          {...params}
                          label="Comprador"
                          required
                          error={!!errors.buyer_id}
                          helperText={errors.buyer_id?.message}
                        />
                      )}
                      renderOption={(props, option) => (
                        <Box component="li" {...props}>
                          <Box>
                            <Typography variant="body1">
                              {option.name}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {option.email} - {option.phone}
                            </Typography>
                          </Box>
                        </Box>
                      )}
                    />
                  )}
                />
              </Grid>

              {/* Vendedor */}
              <Grid item xs={12} md={6}>
                <Controller
                  name="seller_id"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      options={users}
                      getOptionLabel={option =>
                        typeof option === 'object'
                          ? `${option.name} (${option.email})`
                          : ''
                      }
                      value={
                        users.find(user => user.id === field.value) || null
                      }
                      onChange={(_, value) => field.onChange(value?.id || 0)}
                      disabled={isEditing} // Não permitir alterar vendedor ao editar
                      renderInput={params => (
                        <TextField
                          {...params}
                          label="Vendedor"
                          required
                          error={!!errors.seller_id}
                          helperText={errors.seller_id?.message}
                        />
                      )}
                      renderOption={(props, option) => (
                        <Box component="li" {...props}>
                          <Box>
                            <Typography variant="body1">
                              {option.name}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {option.email} - {option.phone}
                            </Typography>
                          </Box>
                        </Box>
                      )}
                    />
                  )}
                />
              </Grid>

              {/* Preço */}
              <Grid item xs={12} md={6}>
                <Controller
                  name="price"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Preço da Venda"
                      type="number"
                      required
                      error={!!errors.price}
                      helperText={errors.price?.message}
                      InputProps={{
                        startAdornment: 'R$ ',
                      }}
                      onChange={e =>
                        field.onChange(parseFloat(e.target.value) || 0)
                      }
                    />
                  )}
                />
              </Grid>

              {/* Status (apenas ao editar) */}
              {isEditing && (
                <Grid item xs={12} md={6}>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth>
                        <InputLabel>Status</InputLabel>
                        <Select {...field} label="Status">
                          <MenuItem value="pending">Pendente</MenuItem>
                          <MenuItem value="completed">Concluída</MenuItem>
                          <MenuItem value="cancelled">Cancelada</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>
              )}

              {/* Observações */}
              <Grid item xs={12}>
                <Controller
                  name="notes"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Observações"
                      multiline
                      rows={3}
                      error={!!errors.notes}
                      helperText={errors.notes?.message}
                    />
                  )}
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || loadingData}
          >
            {loading ? 'Salvando...' : isEditing ? 'Atualizar' : 'Criar'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
