import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, LogOut, Mail, Lock, User as UserIcon, Search, X, Save } from 'lucide-react';

// menghubung fe ke be 
const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

interface User { id: string; name: string; email: string; }
interface Note { id: string; userId: string; title: string; content: string; createdAt: number; updatedAt: number; }

// api pemanggilan ke backend
const BackendAPI = {
  register: async (name: string, email: string, password: string) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    return res.json();
  },
  login: async (email: string, password: string) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return res.json();
  },
  getNotesByUserId: async (userId: string) => {
    const res = await fetch(`${API_URL}/notes/${userId}`);
    return res.json();
  },
  createNote: async (userId: string, title: string, content: string) => {
    const res = await fetch(`${API_URL}/notes`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, title, content })
    });
    return res.json();
  },
  updateNote: async (noteId: string, title: string, content: string) => {
    const res = await fetch(`${API_URL}/notes/${noteId}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content })
    });
    return res.json();
  },
  deleteNote: async (noteId: string) => {
    const res = await fetch(`${API_URL}/notes/${noteId}`, { method: 'DELETE' });
    return res.json();
  }
};

// ui componen
const Button = ({ children, onClick, variant = 'primary', className = '', type = 'button', disabled = false }: any) => {
  const baseStyle = "flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm",
    secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200",
    danger: "bg-red-50 text-red-600 hover:bg-red-100",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100"
  };
  return <button type={type} onClick={onClick} disabled={disabled} className={`${baseStyle} ${variants[variant as keyof typeof variants]} ${className}`}>{children}</button>;
};

const Input = ({ icon: Icon, ...props }: any) => (
  <div className="relative">
    {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />}
    <input className={`w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${Icon ? 'pl-10' : ''}`} {...props} />
  </div>
);

// auth & dashboard
export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  useEffect(() => {
    const session = localStorage.getItem('notes_session');
    if (session) setCurrentUser(JSON.parse(session));
    setIsLoadingAuth(false);
  }, []);

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('notes_session', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('notes_session');
  };

  if (isLoadingAuth) return <div className="min-h-screen flex items-center justify-center"><p className="animate-pulse">Memuat aplikasi...</p></div>;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {currentUser ? <Dashboard user={currentUser} onLogout={handleLogout} /> : <AuthScreen onLoginSuccess={handleLoginSuccess} />}
    </div>
  );
}

// view login & register
function AuthScreen({ onLoginSuccess }: { onLoginSuccess: (user: User) => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    const res = isLogin 
      ? await BackendAPI.login(formData.email, formData.password)
      : await BackendAPI.register(formData.name, formData.email, formData.password);
    
    if (res.success && res.data) onLoginSuccess(res.data);
    else setError(res.message || 'Terjadi kesalahan');
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-xl mb-4"><Edit2 size={24} /></div>
          <h1 className="text-2xl font-bold text-slate-800">{isLogin ? 'Selamat Datang' : 'Buat Akun'}</h1>
        </div>
        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center font-medium">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && <Input icon={UserIcon} type="text" placeholder="Nama" value={formData.name} onChange={(e: any) => setFormData({...formData, name: e.target.value})} required />}
          <Input icon={Mail} type="email" placeholder="Email" value={formData.email} onChange={(e: any) => setFormData({...formData, email: e.target.value})} required />
          <Input icon={Lock} type="password" placeholder="Password" value={formData.password} onChange={(e: any) => setFormData({...formData, password: e.target.value})} required />
          <Button type="submit" className="w-full mt-6" disabled={loading}>{loading ? 'Memproses...' : (isLogin ? 'Masuk' : 'Daftar')}</Button>
        </form>
        <div className="mt-6 text-center text-sm">
          <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-blue-600 font-semibold hover:underline">
            {isLogin ? 'Belum punya akun? Daftar' : 'Sudah punya akun? Masuk'}
          </button>
        </div>
      </div>
    </div>
  );
}

// view dashboard notes
function Dashboard({ user, onLogout }: { user: User, onLogout: () => void }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  const fetchNotes = async () => {
    const res = await BackendAPI.getNotesByUserId(user.id);
    if (res.success && res.data) setNotes(res.data);
  };

  useEffect(() => { fetchNotes(); }, [user.id]);

  const handleSaveNote = async (title: string, content: string) => {
    if (editingNote) await BackendAPI.updateNote(editingNote.id, title, content);
    else await BackendAPI.createNote(user.id, title, content);
    fetchNotes(); setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Hapus catatan ini secara permanen?')) { 
      await BackendAPI.deleteNote(id); 
      fetchNotes(); 
    }
  };

  const filteredNotes = notes.filter(n => n.title.toLowerCase().includes(search.toLowerCase()) || n.content.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8">
      <header className="flex items-center justify-between gap-4 mb-8 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg">{user.name.charAt(0)}</div>
          <div><h2 className="font-bold">Halo, {user.name}</h2></div>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => { setEditingNote(null); setIsModalOpen(true); }}><Plus size={18} className="mr-2" /> Catatan</Button>
          <Button variant="ghost" onClick={onLogout} className="text-red-500 hover:bg-red-50"><LogOut size={18} /></Button>
        </div>
      </header>

      <div className="mb-6 relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input type="text" placeholder="Cari catatan..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-blue-500" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNotes.map(note => (
          <div key={note.id} className="group bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md flex flex-col h-full">
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-2">{note.title}</h3>
              <p className="text-slate-600 text-sm whitespace-pre-wrap">{note.content}</p>
            </div>
            <div className="mt-4 pt-4 border-t flex justify-between items-center">
              <span className="text-xs text-slate-400 font-medium">{new Date(note.updatedAt).toLocaleDateString('id-ID')}</span>
              <div className="flex gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="secondary" className="p-2!" onClick={() => { setEditingNote(note); setIsModalOpen(true); }}><Edit2 size={16} /></Button>
                <Button variant="danger" className="p-2!" onClick={() => handleDelete(note.id)}><Trash2 size={16} /></Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && <NoteModal note={editingNote} onClose={() => setIsModalOpen(false)} onSave={handleSaveNote} />}
    </div>
  );
}

// view tambah & edit notes
function NoteModal({ note, onClose, onSave }: any) {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">{note ? 'Edit Catatan' : 'Buat Catatan Baru'}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700"><X size={20} /></button>
        </div>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Judul catatan..." className="w-full border rounded-lg px-4 py-2.5 mb-4 focus:ring-2 focus:ring-blue-500 font-medium" autoFocus />
        <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Tulis isi catatan Anda di sini..." className="w-full border rounded-lg px-4 py-3 min-h-50 mb-4 focus:ring-2 focus:ring-blue-500 resize-y" />
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>Batal</Button>
          <Button onClick={() => onSave(title, content)} disabled={!title || !content}><Save size={18} className="mr-2" /> Simpan</Button>
        </div>
      </div>
    </div>
  );
}