import { Suspense } from 'react';
import AdmissionForm from './AdmissionForm';

export default function NewAdmissionPage() {
  return (
    <Suspense fallback={<div>Loading form...</div>}>
      <AdmissionForm />
    </Suspense>
  );
}
