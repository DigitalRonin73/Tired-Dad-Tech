import type { Metadata } from 'next';
import ProgramList from './program-list';

export const metadata: Metadata = {
  title: 'Programming list',
  description: 'Team door programming list and completion history.',
  robots: { index: false, follow: false },
};

export default function Page() { return <ProgramList />; }
