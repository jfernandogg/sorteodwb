
"use client";

import type * as React from 'react';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Loader2, AlertTriangle, Eye, CheckCircle2, RefreshCw, Download, ListChecks } from 'lucide-react';
import { authenticateAndFetchEntries, updatePagoVerificadoStatus, type ClientRaffleEntry } from './actions';
import { format } from 'date-fns';
import Link from 'next/link';

export default function AdminViewPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [entries, setEntries] = useState<ClientRaffleEntry[]>([]);
  const [updatingStatus, setUpdatingStatus] = useState<Record<string, boolean>>({});

  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const result = await authenticateAndFetchEntries(password);
      if (result.success && result.entries) {
        setEntries(result.entries);
        setIsAuthenticated(true);
      } else {
        setError(result.message || 'Error desconocido al autenticar.');
        setIsAuthenticated(false);
      }
    } catch (err: any) {
      if (err.message && err.message.includes("Only plain objects")) {
         setError("Error de serialización: Los datos recibidos del servidor no son válidos. " + err.message);
      } else {
        setError(err instanceof Error ? err.message : 'Ocurrió un error.');
      }
      setIsAuthenticated(false);
    }
    setIsLoading(false);
  };

  const handlePagoVerificadoChange = async (entryId: string, newStatus: boolean) => {
    setUpdatingStatus(prev => ({ ...prev, [entryId]: true }));
    try {
      const result = await updatePagoVerificadoStatus(entryId, newStatus);
      if (result.success) {
        setEntries(prevEntries => 
          prevEntries.map(entry => 
            entry.id === entryId ? { ...entry, pagoVerificado: newStatus } : entry
          )
        );
        toast({
          title: "Actualización Exitosa",
          description: result.message || "Estado de pago verificado actualizado.",
          action: <CheckCircle2 className="text-green-500" />,
        });
      } else {
        toast({
          title: "Error al Actualizar",
          description: result.message || "No se pudo actualizar el estado.",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      toast({
        title: "Error de Red",
        description: err instanceof Error ? err.message : "Ocurrió un error de red.",
        variant: "destructive",
      });
    }
    setUpdatingStatus(prev => ({ ...prev, [entryId]: false }));
  };

  const escapeCsvCell = (cellData: string | number | undefined | null): string => {
    if (cellData === undefined || cellData === null) {
      return '';
    }
    const stringData = String(cellData);
    if (stringData.includes(',') || stringData.includes('\n') || stringData.includes('"')) {
      return `"${stringData.replace(/"/g, '""')}"`;
    }
    return stringData;
  };

  const generateCsv = (dataToExport: ClientRaffleEntry[], filename: string) => {
    if (dataToExport.length === 0) {
      toast({
        title: "No hay datos",
        description: `No hay participaciones para descargar en ${filename}.`,
        variant: "default",
      });
      return;
    }

    const headers = [
      "Ticket #", "Nombre", "Apellidos", "Email", "Teléfono", 
      "Participaciones", "Fecha Registro", "Comprobante URL", "IP Cliente", "Pago Verificado"
    ];
    
    const csvRows = [
      headers.join(','),
      ...dataToExport.map(entry => [
        escapeCsvCell(entry.ticketNumber),
        escapeCsvCell(entry.nombre),
        escapeCsvCell(entry.apellidos),
        escapeCsvCell(entry.email),
        escapeCsvCell(entry.telefono),
        escapeCsvCell(entry.stars),
        escapeCsvCell(entry.createdAt ? format(new Date(entry.createdAt.seconds * 1000 + entry.createdAt.nanoseconds / 1000000), 'yyyy-MM-dd HH:mm:ss') : 'N/A'),
        escapeCsvCell(entry.receiptUrl),
        escapeCsvCell(entry.clientIp),
        escapeCsvCell(entry.pagoVerificado ? 'Sí' : 'No') 
      ].join(','))
    ];
    
    const csvString = csvRows.join('\n');
    const blob = new Blob([`\uFEFF${csvString}`], { type: 'text/csv;charset=utf-8;' }); // FEFF for UTF-8 BOM
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const handleDownloadVerified = () => {
    const verifiedEntries = entries.filter(entry => entry.pagoVerificado);
    generateCsv(verifiedEntries, "participaciones_verificadas.csv");
  };

  const handleDownloadAll = () => {
    generateCsv(entries, "todas_las_participaciones.csv");
  };


  if (!isAuthenticated) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen bg-muted/40 p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-headline text-center text-primary">Acceso de Administrador</CardTitle>
            <CardDescription className="text-center">
              Ingresa la contraseña para ver las participaciones de la rifa.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="password_admin" className="text-sm font-medium">Contraseña</label>
                <Input
                  id="password_admin"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  required
                  className="bg-input"
                />
              </div>
              {error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Error de Autenticación</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Eye className="mr-2 h-4 w-4" />}
                Ingresar
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    );
  }

  const verifiedCount = entries.filter(entry => entry.pagoVerificado).length;
  const totalCount = entries.length;

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-primary text-center sm:text-left">Participaciones de la Rifa</h1>
        <div className="flex flex-col sm:flex-row flex-wrap gap-2 items-center justify-center sm:justify-end">
          <Button 
            variant="secondary" 
            onClick={handleDownloadVerified}
            disabled={verifiedCount === 0}
            className="w-full sm:w-auto"
          >
            <ListChecks className="mr-2 h-4 w-4" />
            Descargar Verificados ({verifiedCount})
          </Button>
          <Button 
            variant="secondary" 
            onClick={handleDownloadAll}
            disabled={totalCount === 0}
            className="w-full sm:w-auto"
          >
            <Download className="mr-2 h-4 w-4" />
            Descargar Todos ({totalCount})
          </Button>
          <Button 
            variant="outline" 
            onClick={() => {
              setIsAuthenticated(false);
              setPassword('');
              setEntries([]);
              setError(null);
            }}
            className="w-full sm:w-auto"
          >
            Cerrar Sesión
          </Button>
        </div>
      </div>
      
      {entries.length === 0 ? (
        <p className="text-center text-muted-foreground">No hay participaciones registradas todavía.</p>
      ) : (
        <Card className="shadow-lg">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">Ticket #</TableHead>
                    <TableHead>Nombre Completo</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Teléfono</TableHead>
                    <TableHead className="text-center">Particip.</TableHead>
                    <TableHead>Fecha Registro</TableHead>
                    <TableHead className="text-center">Comprobante</TableHead>
                    <TableHead className="text-center w-[150px]">Pago Verificado</TableHead> 
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {entries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="font-medium">{entry.ticketNumber}</TableCell>
                      <TableCell>{entry.nombre} {entry.apellidos}</TableCell>
                      <TableCell>{entry.email}</TableCell>
                      <TableCell>{entry.telefono}</TableCell>
                      <TableCell className="text-center">{entry.stars}</TableCell>
                      <TableCell>
                        {entry.createdAt ? format(new Date(entry.createdAt.seconds * 1000 + entry.createdAt.nanoseconds / 1000000), 'dd/MM/yyyy HH:mm') : 'N/A'}
                      </TableCell>
                      <TableCell className="text-center">
                        {entry.receiptUrl ? (
                          <Button variant="link" asChild size="sm" className="p-0 h-auto">
                            <Link href={entry.receiptUrl} target="_blank" rel="noopener noreferrer">
                              Ver
                            </Link>
                          </Button>
                        ) : (
                          'N/A'
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {updatingStatus[entry.id] ? (
                          <RefreshCw className="h-5 w-5 animate-spin mx-auto text-primary" />
                        ) : (
                          <Checkbox
                            id={`pagoVerificado-${entry.id}`}
                            checked={!!entry.pagoVerificado}
                            onCheckedChange={(checked) => {
                              handlePagoVerificadoChange(entry.id, Boolean(checked));
                            }}
                            aria-label={`Marcar pago como verificado para ticket ${entry.ticketNumber}`}
                          />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </main>
  );
}

