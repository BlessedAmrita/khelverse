'use client';
import React, { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/firebase/firebase';
import { toast } from 'sonner';

const NewMedicalRecordForm = ({ userId, onSuccess }) => {
    const [form, setForm] = useState({
        condition: '',
        description: '',
        doctorName: '',
        date: '',
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await addDoc(collection(db, 'users', userId, 'medicalRecords'), {
                ...form,
                athleteId: userId,
                timestamp: new Date(),
            });

            toast.success('Medical record added successfully!');
            onSuccess();
        } catch (error) {
            console.error(error);
            toast.error('Failed to add record');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5 bg-transparent">
            {[
                { label: 'Condition', name: 'condition', required: true },
                { label: 'Description', name: 'description' },
                { label: 'Doctor Name', name: 'doctorName', required: true },
            ].map(({ label, name, required }) => (
                <div key={name}>
                    <label htmlFor={name} className="block text-sm font-medium text-white mb-1">
                        {label}{required && ' *'}
                    </label>
                    <input
                        type="text"
                        id={name}
                        name={name}
                        value={form[name]}
                        onChange={handleChange}
                        required={required}
                        className="input w-full rounded-md p-2 bg-white/10 text-white placeholder-gray-400"
                        placeholder={`Enter ${label.toLowerCase()}`}
                    />
                </div>
            ))}

            <div>
                <label htmlFor="date" className="block text-sm font-medium text-white mb-1">Date *</label>
                <input
                    type="date"
                    name="date"
                    id="date"
                    value={form.date}
                    onChange={handleChange}
                    required
                    className="input w-full rounded-md p-2 bg-white/10 text-white"
                />
            </div>
            <div className="flex justify-center">
            <button
                type="submit"
                disabled={loading}
                className={`w-1/2 mt-2 bg-apts-purple-dark p-1 rounded-lg hover:bg-apts-purple pulse-btn text-white/80 ${loading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
            >
                {loading ? (
                    <span className="flex items-center gap-2">
                        <span className="loading loading-spinner loading-sm" />
                        Adding...
                    </span>
                ) : (
                    'Add Medical Record'
                )}
            </button>
            </div>
        </form>
    );
};

export default NewMedicalRecordForm;
