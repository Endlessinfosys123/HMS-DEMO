import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Building2, User, Mail, Lock, CheckCircle2, ArrowRight } from 'lucide-react';

export const Onboarding = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        clinicName: '',
        clinicEmail: '',
        clinicPhone: '',
        clinicAddress: '',
        adminFirstName: '',
        adminLastName: '',
        adminEmail: '',
        adminPassword: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            // 1. Create Clinic
            const { data: clinic, error: clinicError } = await supabase
                .from('clinics')
                .insert({
                    name: formData.clinicName,
                    contact_email: formData.clinicEmail,
                    contact_phone: formData.clinicPhone,
                    address: formData.clinicAddress
                })
                .select()
                .single();

            if (clinicError) throw clinicError;

            // 2. Sign up Admin User with clinic_id in metadata
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: formData.adminEmail,
                password: formData.adminPassword,
                options: {
                    data: {
                        first_name: formData.adminFirstName,
                        last_name: formData.adminLastName,
                        clinic_id: clinic.id
                    }
                }
            });

            if (authError) throw authError;

            setStep(3); // Success
        } catch (err: any) {
            setError(err.message || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent">
            <div className="w-full max-w-2xl">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">HealthCore <span className="text-blue-500">SaaS</span></h1>
                    <p className="text-blue-200/60">Launch your digital hospital in minutes.</p>
                </div>

                <div className="glass-card p-8 md:p-12 relative overflow-hidden">
                    {/* Progress Bar */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
                        <div 
                            className="h-full bg-blue-500 transition-all duration-500" 
                            style={{ width: `${(step / 3) * 100}%` }}
                        />
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    {step === 1 && (
                        <div className="animate-in slide-in-from-right-8 duration-500">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-3 bg-blue-500/20 rounded-xl">
                                    <Building2 className="text-blue-400" size={24} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Clinic Details</h2>
                                    <p className="text-white/40 text-sm">Tell us about your healthcare facility.</p>
                                </div>
                            </div>

                            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InputField label="Clinic Name" name="clinicName" value={formData.clinicName} onChange={handleChange} required placeholder="e.g. City General Hospital" />
                                    <InputField label="Contact Email" name="clinicEmail" type="email" value={formData.clinicEmail} onChange={handleChange} required placeholder="contact@clinic.com" />
                                    <InputField label="Phone Number" name="clinicPhone" value={formData.clinicPhone} onChange={handleChange} required placeholder="+1 (555) 000-0000" />
                                    <InputField label="Address" name="clinicAddress" value={formData.clinicAddress} onChange={handleChange} required placeholder="Full physical address" />
                                </div>

                                <button 
                                    type="submit"
                                    className="w-full mt-8 flex items-center justify-center gap-2 py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all shadow-xl shadow-blue-600/20"
                                >
                                    Next: Admin Account
                                    <ArrowRight size={18} />
                                </button>
                            </form>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="animate-in slide-in-from-right-8 duration-500">
                            <div className="flex items-center gap-3 mb-8">
                                <button onClick={() => setStep(1)} className="text-white/40 hover:text-white transition-colors">
                                    Back
                                </button>
                                <div className="p-3 bg-purple-500/20 rounded-xl ml-auto">
                                    <User className="text-purple-400" size={24} />
                                </div>
                                <div className="text-right">
                                    <h2 className="text-2xl font-bold text-white">Administrator Account</h2>
                                    <p className="text-white/40 text-sm">Your primary login for managing the clinic.</p>
                                </div>
                            </div>

                            <form className="space-y-6" onSubmit={handleSignup}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InputField label="First Name" name="adminFirstName" value={formData.adminFirstName} onChange={handleChange} required />
                                    <InputField label="Last Name" name="adminLastName" value={formData.adminLastName} onChange={handleChange} required />
                                    <div className="md:col-span-2">
                                        <InputField label="Admin Email" name="adminEmail" type="email" value={formData.adminEmail} onChange={handleChange} required />
                                    </div>
                                    <div className="md:col-span-2">
                                        <InputField label="Password" name="adminPassword" type="password" value={formData.adminPassword} onChange={handleChange} required minLength={8} />
                                    </div>
                                </div>

                                <button 
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full mt-8 flex items-center justify-center gap-2 py-4 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-semibold rounded-xl transition-all shadow-xl shadow-purple-600/20"
                                >
                                    {isLoading ? 'Creating Your Workspace...' : 'Create My Clinic Account'}
                                    {!isLoading && <CheckCircle2 size={18} />}
                                </button>
                            </form>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="text-center py-12 animate-in zoom-in duration-500">
                            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 className="text-green-500" size={40} />
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-4">Registration Successful!</h2>
                            <p className="text-white/60 mb-8 max-w-md mx-auto">
                                Your clinic workspace has been created. Please check your email for a verification link to activate your account.
                            </p>
                            <Link 
                                to="/login" 
                                className="inline-block px-8 py-3 bg-white text-[#0f172a] font-bold rounded-xl hover:bg-blue-50 transition-colors"
                            >
                                Go to Login
                            </Link>
                        </div>
                    )}
                </div>

                <p className="text-center mt-8 text-white/40 text-sm">
                    Already have an account? <Link to="/login" className="text-blue-400 hover:underline">Sign In</Link>
                </p>
            </div>
        </div>
    );
};

const InputField = ({ label, ...props }: any) => (
    <div className="space-y-1.5">
        <label className="text-sm font-medium text-white/60 block">{label}</label>
        <input 
            {...props}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.08] transition-all"
        />
    </div>
);
