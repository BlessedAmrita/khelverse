'use client';

export default function Step4({ formData, setFormData }) {
  return (
    <div>
      <h2 className='text-2xl text-lavender-200 font-bold mb-4 font-sprintura'>Achievements & Final Details</h2>

      <div className='my-3'>
        <label>Achievements</label>
        <textarea
          placeholder='Enter notable achievements (optional)'
          value={formData.achievements}
          onChange={(e) => setFormData({ ...formData, achievements: e.target.value })}
          className='border bg-apts-lightdark p-2 w-full h-20 border-white/20'
        />
      </div>
    </div>
  );
}
