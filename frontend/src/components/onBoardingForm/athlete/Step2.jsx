'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { sportsList } from '@/content/sportsList';

export default function Step2({ formData, setFormData, formErrors = {} }) {
  return (
    <div>
      <h2 className='text-2xl text-lavender-200 font-bold mb-4 font-sprintura'>Sports & Experience</h2>

      <div className='my-3'>
        <Label className="text-white">Sport</Label>
        <Select
          value={formData.sport}
          onValueChange={(value) => setFormData({ ...formData, sport: value })}
        >
          <SelectTrigger className="w-full border border-white/20 bg-transparent text-white mt-1">
            <SelectValue placeholder="Select your primary sport" />
          </SelectTrigger>
          <SelectContent className="bg-apts-lightdark text-white">
            {sportsList.map((sport) => (
              <SelectItem key={sport} value={sport}>
                {sport}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {formErrors.sport && (
          <p className='text-purple-dark text-sm mt-1'>{formErrors.sport}</p>
        )}
      </div>

      <div className='my-3'>
        <Label className="text-white">Experience Level</Label>
        <select
          value={formData.experienceLevel}
          onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
          className='border p-2 w-full bg-apts-lightdark text-white mt-1'
        >
          <option>Beginner</option>
          <option>Intermediate</option>
          <option>Professional</option>
        </select>
      </div>
    </div>
  );
}
