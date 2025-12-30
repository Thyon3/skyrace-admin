import React, { useState, useEffect } from 'react';
import { X, Plane, Calendar, Clock, MapPin, DollarSign } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/client';
import toast from 'react-hot-toast';

interface EditFlightModalProps {
    isOpen: boolean;
    onClose: () => void;
    flight: any;
}

const EditFlightModal: React.FC<EditFlightModalProps> = ({ isOpen, onClose, flight }) => {
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState({
        airline: '',
        flightNumber: '',
        origin: '',
        destination: '',
        departureTime: '',
        arrivalTime: '',
        price: '',
        duration: '',
        availableSeats: '',
        gate: '',
        terminal: ''
    });

    useEffect(() => {
        if (flight) {
            setFormData({
                airline: flight.airline,
                flightNumber: flight.flightNumber,
                origin: flight.origin,
                destination: flight.destination,
                departureTime: flight.departureTime ? new Date(flight.departureTime).toISOString().slice(0, 16) : '',
                arrivalTime: flight.arrivalTime ? new Date(flight.arrivalTime).toISOString().slice(0, 16) : '',
                price: flight.price,
                duration: flight.duration,
                availableSeats: flight.availableSeats,
                gate: flight.gate || '',
                terminal: flight.terminal || ''
            });
        }
    }, [flight]);

    const mutation = useMutation({
        mutationFn: (updatedFlight: any) => api.patch(`/admin/flights/${flight._id}`, updatedFlight),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-flights'] });
            toast.success('Flight updated successfully!');
            onClose();
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || 'Failed to update flight');
        }
    });

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate({
            ...formData,
            price: parseFloat(formData.price as string),
            duration: parseInt(formData.duration as string),
            availableSeats: parseInt(formData.availableSeats as string),
            departureTime: new Date(formData.departureTime).toISOString(),
            arrivalTime: new Date(formData.arrivalTime).toISOString(),
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-6">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="px-8 py-6 border-b flex justify-between items-center bg-gray-50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            <Plane size={24} />
                        </div>
                        <h2 className="text-xl font-bold text-secondary">Edit Flight</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Airline Name</label>
                            <input
                                type="text"
                                required
                                className="input-field"
                                placeholder="e.g. SkyHigh Airlines"
                                value={formData.airline}
                                onChange={(e) => setFormData({ ...formData, airline: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Flight Number</label>
                            <input
                                type="text"
                                required
                                className="input-field"
                                placeholder="e.g. SH123"
                                value={formData.flightNumber}
                                onChange={(e) => setFormData({ ...formData, flightNumber: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Origin (City & Code)</label>
                            <input
                                type="text"
                                required
                                className="input-field"
                                placeholder="e.g. London (LHR)"
                                value={formData.origin}
                                onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Destination (City & Code)</label>
                            <input
                                type="text"
                                required
                                className="input-field"
                                placeholder="e.g. New York (JFK)"
                                value={formData.destination}
                                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Departure Time</label>
                            <input
                                type="datetime-local"
                                required
                                className="input-field"
                                value={formData.departureTime}
                                onChange={(e) => setFormData({ ...formData, departureTime: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Arrival Time</label>
                            <input
                                type="datetime-local"
                                required
                                className="input-field"
                                value={formData.arrivalTime}
                                onChange={(e) => setFormData({ ...formData, arrivalTime: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-4 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Price ($)</label>
                            <input
                                type="number"
                                required
                                className="input-field"
                                placeholder="299.99"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Duration (min)</label>
                            <input
                                type="number"
                                required
                                className="input-field"
                                placeholder="480"
                                value={formData.duration}
                                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Seats</label>
                            <input
                                type="number"
                                required
                                className="input-field"
                                placeholder="150"
                                value={formData.availableSeats}
                                onChange={(e) => setFormData({ ...formData, availableSeats: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Gate</label>
                            <input
                                type="text"
                                className="input-field"
                                placeholder="A12"
                                value={formData.gate}
                                onChange={(e) => setFormData({ ...formData, gate: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="pt-6 flex gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 border rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={mutation.isPending}
                            className="flex-2 btn-primary h-12 flex items-center justify-center gap-2"
                        >
                            {mutation.isPending ? 'Updating...' : 'Update Flight'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditFlightModal;
