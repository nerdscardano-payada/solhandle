import { Link } from 'react-router-dom';
import DiscoverSubmissionForm from '@/components/solhandle/discover/DiscoverSubmissionForm';
import '@/components/solhandle/discover/discover.css';
export default function DiscoverSubmit() {
  return <main className="ep-page"><Link className="ep-link" to="/discover">Back to Discover</Link><header className="ep-page-heading"><span className="ep-eyebrow">HELP BUILD THE DIRECTORY.</span><h1>Submit a listing</h1><p>Introduce your Solana project or profile, or suggest someone worth discovering. A SolHandle handle is optional.</p></header><DiscoverSubmissionForm/></main>;
}