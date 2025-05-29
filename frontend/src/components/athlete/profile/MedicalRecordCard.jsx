import React from 'react';
import { Calendar, Stethoscope, FileText } from 'lucide-react';

const MedicalRecordCard = ({ record }) => {
  const { condition, description, date, doctorName } = record;

  return (
    <div className="glass rounded-lg p-4 shadow-md">
      <div className="flex items-center gap-3 mb-2">
        <Stethoscope className="text-purple-light h-5 w-5" />
        <h3 className="text-lg font-semibold">{condition}</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-2">{description}</p>
      <div className="text-sm text-muted-foreground flex items-center gap-2">
        <Calendar className="h-4 w-4" />
        {new Date(date).toLocaleDateString()}
      </div>
      <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
        <FileText className="h-4 w-4" />
        {doctorName}
      </div>
    </div>
  );
};

export default MedicalRecordCard;
