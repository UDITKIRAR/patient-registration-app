import React, { useState } from 'react';
import { executeQuery } from '../services/DatabaseService';
import { useDatabaseContext } from '../context/DatabaseContext';
import { Database,Copy, Download } from 'lucide-react';

interface QueryResult {
  success: boolean;
  data: any[];
  error: string | null;
}

const exampleQueries = [
  { label: "Basic Query", sql: "SELECT * FROM patients ORDER BY last_name LIMIT 10" },
  { label: "Filter by Name", sql: "SELECT * FROM patients WHERE last_name LIKE 'S%' ORDER BY last_name" },
  { label: "Statistics", sql: "SELECT gender, COUNT(*) as count FROM patients GROUP BY gender" },
];

const PatientQuery: React.FC = () => {
  const { isInitialized } = useDatabaseContext();
  const [sqlQuery, setSqlQuery] = useState<string>('SELECT * FROM patients LIMIT 10');
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const handleQueryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSqlQuery(e.target.value);
  };

  const executeCustomQuery = async () => {
    if (!sqlQuery.trim()) return;

    setIsExecuting(true);
    setQueryResult(null);

    try {
      const result = await executeQuery(sqlQuery);
      setQueryResult(result);
    } catch (error: any) {
      setQueryResult({
        success: false,
        data: [],
        error: error.message || 'An error occurred while executing the query',
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const handleLoadExample = (sql: string) => {
    setSqlQuery(sql);
    setQueryResult(null);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const downloadResults = () => {
    if (!queryResult?.data || queryResult.data.length === 0) return;

    const jsonStr = JSON.stringify(queryResult.data, null, 2);
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(jsonStr);
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "patient_query_results.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  if (!isInitialized) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-gray-400 border-b-gray-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  p-6 font-sans text-gray-900">
      <h1 className="text-3xl font-bold  mb-6 tracking-wide text-black">
        Patient Query
      </h1>
      <p className="mb-8 max-w-xl text-lg text-gray-700">
        Run custom SQL queries against the patient database with an interactive editor and real-time results.
      </p>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar for examples */}
        <aside className="w-full lg:w-64 bg-white bg-opacity-90 rounded-xl p-6 shadow-md border border-gray-300">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Example Queries</h2>
          <div className="flex flex-col gap-3">
            {exampleQueries.map(({ label, sql }) => (
              <button
                key={label}
                onClick={() => handleLoadExample(sql)}
                className="text-gray-800 hover:text-white hover:bg-gray-800 transition rounded-md px-4 py-2 text-left font-medium shadow-sm border border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600"
                title={sql}
              >
                {label}
              </button>
            ))}
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 flex flex-col bg-white bg-opacity-95 rounded-xl shadow-lg border border-gray-300 overflow-hidden">
          <section className="p-6 flex flex-col gap-4">
            <label htmlFor="sqlQuery" className="block text-lg font-semibold text-gray-900 select-none">
              SQL Query
            </label>
            <textarea
              id="sqlQuery"
              value={sqlQuery}
              onChange={handleQueryChange}
              rows={6}
              spellCheck={false}
              autoComplete="off"
              className="font-mono text-sm text-gray-900 bg-gray-100 border border-gray-400 rounded-lg resize-none shadow-inner focus:outline-none focus:ring-4 focus:ring-gray-400 px-4 py-3 transition placeholder-gray-500"
              placeholder="Write your SQL query here..."
              aria-label="SQL Query Input"
            />
            <button
              onClick={executeCustomQuery}
              disabled={isExecuting || !sqlQuery.trim()}
              className={`mt-2 self-start inline-flex items-center gap-2 rounded-lg px-6 py-3 text-white font-semibold tracking-wide shadow-lg transition
                ${isExecuting ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-800 hover:bg-black focus:ring-4 focus:ring-gray-500'}`}
              aria-live="polite"
              aria-busy={isExecuting}
            >
              {isExecuting ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none" viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Running...
                </>
              ) : (
                <>
                  <Database className="h-5 w-5" /> Run Query
                </>
              )}
            </button>
          </section>

          {/* Results */}
          {queryResult && (
            <section className="flex-1 flex flex-col p-6 overflow-auto border-t border-gray-300">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-900">Query Results</h2>
                <div className="flex gap-3">
                  <button
                    onClick={() => copyToClipboard(JSON.stringify(queryResult.data, null, 2))}
                    disabled={!queryResult.success || queryResult.data.length === 0}
                    className="inline-flex items-center gap-1 rounded-md px-4 py-2 border border-gray-400 text-gray-800 hover:bg-gray-800 hover:text-white transition focus:ring-2 focus:ring-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Copy results JSON"
                  >
                    {copied ? (
                      <svg
                        className="h-5 w-5 text-green-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none" viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      <Copy className="h-5 w-5" />
                    )}
                    {copied ? "Copied" : "Copy JSON"}
                  </button>
                  <button
                    onClick={downloadResults}
                    disabled={!queryResult.success || queryResult.data.length === 0}
                    className="inline-flex items-center gap-1 rounded-md px-4 py-2 border border-gray-400 text-gray-800 hover:bg-gray-800 hover:text-white transition focus:ring-2 focus:ring-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Download results JSON"
                  >
                    <Download className="h-5 w-5" />
                    Download JSON
                  </button>
                </div>
              </div>

              {!queryResult.success ? (
                <div className="bg-red-100 border-l-4 border-red-600 p-4 rounded-md text-red-800 font-semibold flex items-center gap-3">
                  <svg
                    className="h-6 w-6 flex-shrink-0"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none" viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>{queryResult.error || 'An error occurred while executing the query'}</span>
                </div>
              ) : queryResult.data.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400 select-none">
                  <svg
                    className="w-16 h-16 mb-4 opacity-40"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none" viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-6a3 3 0 116 0v6m2 0h-8m4-6v6" />
                  </svg>
                  <p className="text-lg font-medium">No results found.</p>
                  <p className="text-sm mt-1 max-w-xs text-center text-gray-600">
                    Your query did not return any rows.
                  </p>
                </div>
              ) : (
                <div className="overflow-auto rounded-md border border-gray-300 shadow-inner">
                  <table className="min-w-full divide-y divide-gray-300 text-sm text-gray-900 font-mono">
                    <thead className="bg-gray-200 sticky top-0 z-10">
                      <tr>
                        {Object.keys(queryResult.data[0]).map((col) => (
                          <th
                            key={col}
                            className="px-4 py-2 text-left font-semibold tracking-wide"
                          >
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {queryResult.data.map((row, i) => (
                        <tr
                          key={i}
                          className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                        >
                          {Object.values(row).map((val, j) => (
                            <td key={j} className="px-4 py-2 max-w-xs truncate" title={typeof val === 'object' ? JSON.stringify(val) : String(val)}>
                              {val === null ? (
                                <span className="italic text-gray-400">null</span>
                              ) : typeof val === 'object' ? (
                                <pre className="whitespace-pre-wrap break-words">{JSON.stringify(val)}</pre>
                              ) : (
                                String(val)
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {queryResult.success && queryResult.data.length > 0 && (
                <p className="mt-3 text-right text-sm text-gray-600">
                  Showing {queryResult.data.length} {queryResult.data.length === 1 ? 'result' : 'results'}
                </p>
              )}
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default PatientQuery;
