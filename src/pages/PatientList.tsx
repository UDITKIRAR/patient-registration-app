import React, { useEffect, useState } from 'react';
import { getAllPatients, searchPatientsByName } from '../services/DatabaseService';
import { useDatabaseContext } from '../context/DatabaseContext';
import { Search, Download } from 'lucide-react';

interface Patient {
  id: number;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  medical_notes: string | null;
  insurance_provider: string | null;
  insurance_id: string | null;
  created_at: string;
}

const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-16">
    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-gray-300 border-b-2"></div>
    <span className="ml-3 text-gray-500">Loading patients...</span>
  </div>
);

const EmptyState = ({ searchTerm }: { searchTerm: string }) => (
  <div className="text-center py-16 text-gray-600">
    <p className="text-lg font-semibold">No patients found</p>
    <p className="text-sm">
      {searchTerm ? 'Try refining your search.' : 'Start by registering a patient.'}
    </p>
  </div>
);

const PatientSearchBar = ({
  searchTerm,
  setSearchTerm,
  onSearch,
  onClear,
  disableExport,
  onExport,
}: {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  onSearch: () => void;
  onClear: () => void;
  disableExport: boolean;
  onExport: () => void;
}) => (
  <div className="bg-white shadow rounded-lg p-4 mb-8">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="relative w-full sm:max-w-xs">
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        <input
          type="text"
          className="form-input pl-10 py-1 w-full"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSearch()}
          aria-label="Search patients by name"
        />
      </div>
      <div className="flex gap-4 flex-wrap">
  <button
    className="btn btn-outline px-5 py-2 rounded-md font-semibold border text-white bg-blue-500 border-gray-400 text-gray-700 hover:bg-blue-400 transition"
    onClick={onSearch}
  >
    Search
  </button>
  <button
    className="btn btn-outline px-5 py-2 rounded-md font-semibold border border-gray-400 text-gray-700 hover:bg-gray-100 transition"
    onClick={onClear}
  >
    Clear
  </button>
  <button
    className="btn btn-secondary flex items-center px-5 py-2 rounded-md font-semibold bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
    onClick={onExport}
    disabled={disableExport}
  >
    <Download className="h-4 w-4 mr-2" />
    Export
  </button>
</div>

    </div>
  </div>
);

const PatientTable = ({
  patients,
  sortField,
  sortDirection,
  onSort,
}: {
  patients: Patient[];
  sortField: keyof Patient;
  sortDirection: 'asc' | 'desc';
  onSort: (field: keyof Patient) => void;
}) => {
  // Helper to render sorting arrows
  const SortArrow = ({ field }: { field: keyof Patient }) => {
    if (sortField !== field) return null;
    return <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>;
  };

  return (
    <div className="overflow-x-auto bg-white shadow rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              className="cursor-pointer hover:bg-gray-100 px-4 py-3 text-left text-sm font-semibold text-gray-700"
              onClick={() => onSort('last_name')}
              scope="col"
            >
              <div className="flex items-center select-none">
                Name <SortArrow field="last_name" />
              </div>
            </th>
            <th
              className="cursor-pointer hover:bg-gray-100 px-4 py-3 text-left text-sm font-semibold text-gray-700"
              onClick={() => onSort('date_of_birth')}
              scope="col"
            >
              <div className="flex items-center select-none">
                Date of Birth <SortArrow field="date_of_birth" />
              </div>
            </th>
            <th
              className="cursor-pointer hover:bg-gray-100 px-4 py-3 text-left text-sm font-semibold text-gray-700"
              onClick={() => onSort('gender')}
              scope="col"
            >
              <div className="flex items-center select-none">
                Gender <SortArrow field="gender" />
              </div>
            </th>
            <th
              className="cursor-pointer hover:bg-gray-100 px-4 py-3 text-left text-sm font-semibold text-gray-700"
              onClick={() => onSort('email')}
              scope="col"
            >
              <div className="flex items-center select-none">
                Email <SortArrow field="email" />
              </div>
            </th>
            <th
              className="cursor-pointer hover:bg-gray-100 px-4 py-3 text-left text-sm font-semibold text-gray-700"
              onClick={() => onSort('phone')}
              scope="col"
            >
              <div className="flex items-center select-none">
                Phone <SortArrow field="phone" />
              </div>
            </th>
            <th
              className="cursor-pointer hover:bg-gray-100 px-4 py-3 text-left text-sm font-semibold text-gray-700"
              onClick={() => onSort('created_at')}
              scope="col"
            >
              <div className="flex items-center select-none">
                Registration Date <SortArrow field="created_at" />
              </div>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {patients.map((patient) => (
            <tr
              key={patient.id}
              className="hover:bg-gray-50 cursor-default"
              tabIndex={0}
              aria-label={`Patient ${patient.first_name} ${patient.last_name}`}
            >
              <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900">
                {patient.first_name} {patient.last_name}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">{patient.date_of_birth}</td>
              <td className="px-4 py-3 whitespace-nowrap capitalize">{patient.gender}</td>
              <td className="px-4 py-3 whitespace-nowrap">{patient.email || '—'}</td>
              <td className="px-4 py-3 whitespace-nowrap">{patient.phone || '—'}</td>
              <td className="px-4 py-3 whitespace-nowrap">
                {new Date(patient.created_at).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const PatientList: React.FC = () => {
  const { isInitialized } = useDatabaseContext();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [sortField, setSortField] = useState<keyof Patient>('last_name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    if (isInitialized) {
      loadPatients();
    }
  }, [isInitialized]);

  const loadPatients = async () => {
    setIsLoading(true);
    try {
      const patientData = await getAllPatients();
      setPatients(patientData);
    } catch (error) {
      console.error('Error loading patients:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      await loadPatients();
      return;
    }

    setIsLoading(true);
    try {
      const results = await searchPatientsByName(searchTerm);
      setPatients(results);
    } catch (error) {
      console.error('Error searching patients:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSort = (field: keyof Patient) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedPatients = [...patients].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (aValue === null && bValue === null) return 0;
    if (aValue === null) return sortDirection === 'asc' ? 1 : -1;
    if (bValue === null) return sortDirection === 'asc' ? -1 : 1;

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const downloadPatientData = () => {
    if (patients.length === 0) return;

    const jsonStr = JSON.stringify(patients, null, 2);
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(jsonStr);
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute('href', dataStr);
    downloadAnchorNode.setAttribute('download', 'patient_data.json');
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  if (!isInitialized) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="page-transition max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <header className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Patient List</h1>
            <p className="text-sm text-gray-600">View and manage all registered patients.</p>
          </div>
          <span className="text-lg text-gray-700 font-medium select-none">
            {patients.length} {patients.length === 1 ? 'patient' : 'patients'} registered
          </span>
        </div>
      </header>

      <PatientSearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onSearch={handleSearch}
        onClear={() => {
          setSearchTerm('');
          loadPatients();
        }}
        disableExport={patients.length === 0}
        onExport={downloadPatientData}
      />

      {isLoading ? (
        <LoadingSpinner />
      ) : patients.length === 0 ? (
        <EmptyState searchTerm={searchTerm} />
      ) : (
        <PatientTable
          patients={sortedPatients}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
        />
      )}
    </div>
  );
};

export default PatientList;
