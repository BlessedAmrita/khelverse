'use client';
import React, { useState } from "react";
import { db } from "@/firebase/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "sonner";

const NewAchievementForm = ({ userId, onSuccess }) => {
  const [form, setForm] = useState({ title: '', description: '', date: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.date) {
      toast.error("Title and Date are required!");
      return;
    }

    try {
      setSubmitting(true);

      await addDoc(collection(db, "users", userId, "achievements"), {
        ...form,
        createdAt: serverTimestamp()
      });

      toast.success("Achievement added!");
      setForm({ title: '', description: '', date: '' });

      onSuccess?.(); // Close modal + refresh
    } catch (err) {
      console.error("Error adding achievement:", err);
      toast.error("Failed to add achievement.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block font-semibold mb-1">Title *</label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          required
          className="input w-full rounded-md p-2 bg-white/10 text-white placeholder-gray-300"
          placeholder="e.g. State Champion 2024"
        />
      </div>

      <div>
        <label className="block font-semibold mb-1">Description (optional)</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="input w-full rounded-md p-2 bg-white/10 text-white placeholder-gray-300"
          placeholder="Describe your achievement..."
        />
      </div>

      <div>
        <label className="block font-semibold mb-1">Date *</label>
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
          className="input w-full rounded-md p-2 bg-white/10 text-white"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="btn btn-primary w-full mt-2"
      >
        {submitting ? "Adding..." : "Add Achievement"}
      </button>
    </form>
  );
};

export default NewAchievementForm;
