import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Loader2, Users, TrendingUp, Globe, Target, Download, RefreshCw } from 'lucide-react';
import { getUserRegistrations, getRegistrationStats, subscribeToNewRegistrations, unsubscribeFromRegistrations, UserRegistration } from '../lib/supabase';
import { formatNumber, formatCurrency } from '../lib/utils';

interface RegistrationStats {
  totalRegistrations: number;
  byCountry: { [key: string]: number };
  byObjective: { [key: string]: number };
  byExperience: { hasExperience: number; noExperience: number };
  averageMonthlyAmount: number;
  averageDuration: number;
}

export const AdminDashboard: React.FC = () => {
  const [registrations, setRegistrations] = useState<UserRegistration[]>([]);
  const [stats, setStats] = useState<RegistrationStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError('');

      // Charger les inscriptions
      const registrationsData = await getUserRegistrations();
      setRegistrations(registrationsData || []);

      // Charger les statistiques
      const statsData = await getRegistrationStats();
      if (statsData) {
        const calculatedStats: RegistrationStats = {
          totalRegistrations: statsData.length,
          byCountry: {},
          byObjective: {},
          byExperience: { hasExperience: 0, noExperience: 0 },
          averageMonthlyAmount: 0,
          averageDuration: 0
        };

        // Calculer les statistiques
        statsData.forEach(item => {
          // Par pays
          calculatedStats.byCountry[item.country] = (calculatedStats.byCountry[item.country] || 0) + 1;
          
          // Par objectif
          calculatedStats.byObjective[item.selected_objective] = (calculatedStats.byObjective[item.selected_objective] || 0) + 1;
          
          // Par expérience
          if (item.has_used_savings_app) {
            calculatedStats.byExperience.hasExperience++;
          } else {
            calculatedStats.byExperience.noExperience++;
          }
        });

        // Moyennes
        if (statsData.length > 0) {
          calculatedStats.averageMonthlyAmount = Math.round(
            statsData.reduce((sum, item) => sum + item.monthly_amount, 0) / statsData.length
          );
          calculatedStats.averageDuration = Math.round(
            statsData.reduce((sum, item) => sum + item.duration, 0) / statsData.length * 10
          ) / 10;
        }

        setStats(calculatedStats);
      }

      setLastUpdate(new Date());
    } catch (err: any) {
      console.error('Erreur lors du chargement des données:', err);
      setError(err.message || 'Erreur lors du chargement des données');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // S'abonner aux nouvelles inscriptions en temps réel
    const subscription = subscribeToNewRegistrations((payload) => {
      console.log('Nouvelle inscription reçue:', payload);
      loadData(); // Recharger les données
    });

    return () => {
      unsubscribeFromRegistrations(subscription);
    };
  }, []);

  const exportToCSV = () => {
    if (!registrations.length) return;

    const headers = [
      'Date d\'inscription',
      'Nom complet',
      'Numéro WhatsApp',
      'Pays',
      'A utilisé une app d\'épargne',
      'Motivation',
      'Montant idéal mensuel',
      'Objectif sélectionné',
      'Montant mensuel configuré',
      'Durée (années)',
      'Montant projeté'
    ];

    const csvContent = [
      headers.join(','),
      ...registrations.map(reg => [
        new Date(reg.created_at || '').toLocaleDateString('fr-FR'),
        `"${reg.full_name}"`,
        `"${reg.whatsapp_number}"`,
        `"${reg.country}"`,
        reg.has_used_savings_app ? 'Oui' : 'Non',
        `"${reg.saving_motivation}"`,
        `"${reg.ideal_monthly_amount}"`,
        `"${reg.selected_objective}"`,
        reg.monthly_amount,
        reg.duration,
        reg.projected_amount
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `inscriptions_sama_naffa_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-[#435933]" />
          <p className="text-gray-600">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={loadData} className="bg-[#435933] hover:bg-[#364529]">
              Réessayer
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Tableau de bord Sama Naffa
              </h1>
              <p className="text-gray-600">
                Dernière mise à jour: {lastUpdate.toLocaleString('fr-FR')}
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={loadData}
                variant="outline"
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Actualiser
              </Button>
              <Button
                onClick={exportToCSV}
                className="bg-[#435933] hover:bg-[#364529] flex items-center gap-2"
                disabled={!registrations.length}
              >
                <Download className="w-4 h-4" />
                Exporter CSV
              </Button>
            </div>
          </div>
        </div>

        {/* Statistiques générales */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total inscriptions</p>
                    <p className="text-3xl font-bold text-[#435933]">{formatNumber(stats.totalRegistrations)}</p>
                  </div>
                  <Users className="w-8 h-8 text-[#435933]" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Épargne moyenne</p>
                    <p className="text-2xl font-bold text-[#C38D1C]">
                      {formatCurrency(stats.averageMonthlyAmount)}
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-[#C38D1C]" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Durée moyenne</p>
                    <p className="text-3xl font-bold text-purple-600">{stats.averageDuration} ans</p>
                  </div>
                  <Target className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pays représentés</p>
                    <p className="text-3xl font-bold text-blue-600">
                      {formatNumber(Object.keys(stats.byCountry).length)}
                    </p>
                  </div>
                  <Globe className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Répartition par pays et objectifs */}
        {stats && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Répartition par pays</h3>
                <div className="space-y-3">
                  {Object.entries(stats.byCountry)
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, 5)
                    .map(([country, count]) => (
                      <div key={country} className="flex justify-between items-center">
                        <span className="text-gray-700">{country}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-[#435933] h-2 rounded-full"
                              style={{
                                width: `${(count / stats.totalRegistrations) * 100}%`
                              }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-900 w-8">
                            {formatNumber(count)}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Objectifs populaires</h3>
                <div className="space-y-3">
                  {Object.entries(stats.byObjective)
                    .sort(([,a], [,b]) => b - a)
                    .map(([objective, count]) => (
                      <div key={objective} className="flex justify-between items-center">
                        <span className="text-gray-700">{objective}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-[#C38D1C] h-2 rounded-full"
                              style={{
                                width: `${(count / stats.totalRegistrations) * 100}%`
                              }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-900 w-8">
                            {formatNumber(count)}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Liste des inscriptions récentes */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Inscriptions récentes</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Date</th>
                    <th className="text-left py-2">Nom</th>
                    <th className="text-left py-2">WhatsApp</th>
                    <th className="text-left py-2">Pays</th>
                    <th className="text-left py-2">Objectif</th>
                    <th className="text-left py-2">Montant/mois</th>
                    <th className="text-left py-2">Durée</th>
                  </tr>
                </thead>
                <tbody>
                  {registrations.slice(0, 10).map((reg) => (
                    <tr key={reg.id} className="border-b hover:bg-gray-50">
                      <td className="py-2">
                        {new Date(reg.created_at || '').toLocaleDateString('fr-FR')}
                      </td>
                      <td className="py-2 font-medium">{reg.full_name}</td>
                      <td className="py-2">{reg.whatsapp_number}</td>
                      <td className="py-2">{reg.country}</td>
                      <td className="py-2">{reg.selected_objective}</td>
                      <td className="py-2">{formatCurrency(reg.monthly_amount)}</td>
                      <td className="py-2">{reg.duration} ans</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {registrations.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Aucune inscription pour le moment
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};