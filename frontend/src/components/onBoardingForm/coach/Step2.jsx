'use client';

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/custom/MultiSelectChips';
import { sportExpertiseMap } from '@/content/sportExpertiseMap';
import { sportsList } from '@/content/sportsList';
import { commonCertifications } from '@/content/certifications';

export default function Step2({ formData, setFormData, errors }) {
  const sport = formData.sport;
  const dynamicExpertiseOptions = sportExpertiseMap[sport] || [];

  return (
    <div>
      <h2 className='text-2xl font-sprintura text-lavender-200 font-bold mb-4'>Coaching Experience</h2>

      {/* Sport */}
      <div className='my-3'>
        <Label className='text-white'>Sport</Label>
        <Select
          value={formData.sport}
          onValueChange={(value) => setFormData({ ...formData, sport: value, expertise: [] })}
        >
          <SelectTrigger className='w-full border border-white/20 bg-transparent text-white mt-1'>
            <SelectValue placeholder='Select your sport' />
          </SelectTrigger>
          <SelectContent className='bg-apts-lightdark text-white'>
            {sportsList.map((sport) => (
              <SelectItem key={sport} value={sport}>{sport}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors?.sport && <p className='text-sm text-purple-dark mt-1'>{errors.sport}</p>}
      </div>

      {/* Expertise */}
      {sport && (
        <div className='my-3'>
          <Label className='text-lavender-100 block'>Expertise in {sport}</Label>
          <MultiSelect
            options={dynamicExpertiseOptions}
            selected={formData.expertise || []}
            onChange={(selected) => setFormData({ ...formData, expertise: selected })}
          />
          {errors?.expertise && <p className='text-sm text-purple-dark mt-1'>{errors.expertise}</p>}
        </div>
      )}

      {/* Experience */}
      <div className='my-3'>
        <label>Years of Experience</label>
        <Input
          type='number'
          placeholder='Enter your experience'
          value={formData.experience}
          onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
          className='border border-white/20 bg-transparent text-white mt-1'
        />
        {errors?.experience && <p className='text-sm text-purple-dark mt-1'>{errors.experience}</p>}
      </div>

      {/* Level */}
      <div className='my-3'>
        <Label className='text-white'>Level</Label>
        <Select
          value={formData.level}
          onValueChange={(value) => setFormData({ ...formData, level: value })}
        >
          <SelectTrigger className='w-full border border-white/20 bg-transparent text-white mt-1'>
            <SelectValue placeholder='Select Level' />
          </SelectTrigger>
          <SelectContent className='bg-apts-lightdark text-white'>
            <SelectItem value='Beginner'>Beginner</SelectItem>
            <SelectItem value='Intermediate'>Intermediate</SelectItem>
            <SelectItem value='Pro'>Pro</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Certifications*/}
      <div className='my-3'>
        <Label className='text-white block mb-1'>Certifications</Label>
        <div className="max-h-44 overflow-y-auto pr-1 border border-white/20 rounded-md">
          <MultiSelect
            options={commonCertifications}
            selected={formData.certifications || []}
            onChange={(selected) => setFormData({ ...formData, certifications: selected })}
          />
        </div>
      </div>

      {/* Training Mode */}
      <div className='my-3'>
        <Label className='text-white'>Training Mode</Label>
        <Select
          value={formData.trainingMode}
          onValueChange={(value) => setFormData({ ...formData, trainingMode: value })}
        >
          <SelectTrigger className='w-full border border-white/20 bg-transparent text-white mt-1'>
            <SelectValue placeholder='Select Mode' />
          </SelectTrigger>
          <SelectContent className='bg-apts-lightdark text-white'>
            <SelectItem value='Online'>Online</SelectItem>
            <SelectItem value='Offline'>Offline</SelectItem>
            <SelectItem value='Hybrid'>Hybrid</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
