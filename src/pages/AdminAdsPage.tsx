import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Advertisement } from '../types';
import { advertisementService } from '../services/localDataService';
import './AdminAdsPage.css';

const EMPTY_FORM: Omit<Advertisement, 'id' | 'impressions' | 'clicks' | 'createdAt'> = {
  title: '',
  description: '',
  advertiserName: '',
  advertiserUrl: '',
  mediaType: 'image',
  mediaUrl: '',
  thumbnailUrl: '',
  allowFullscreen: false,
  startDate: new Date(),
  endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  frequency: 3,
  isActive: true,
  paymentStatus: 'pending',
  paymentAmount: 0,
  createdBy: '',
};

const AdminAdsPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useApp();
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingAd, setEditingAd] = useState<Advertisement | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser && !currentUser.isAdmin) navigate('/feed');
  }, [currentUser, navigate]);

  useEffect(() => {
    const load = async () => {
      const data = await advertisementService.getAll();
      setAds(data);
      setLoading(false);
    };
    load();
  }, []);

  const openCreate = () => {
    setEditingAd(null);
    setForm({ ...EMPTY_FORM, createdBy: currentUser?.id || '' });
    setShowForm(true);
  };

  const openEdit = (ad: Advertisement) => {
    setEditingAd(ad);
    setForm({
      title: ad.title,
      description: ad.description || '',
      advertiserName: ad.advertiserName,
      advertiserUrl: ad.advertiserUrl,
      mediaType: ad.mediaType,
      mediaUrl: ad.mediaUrl,
      thumbnailUrl: ad.thumbnailUrl || '',
      allowFullscreen: ad.allowFullscreen,
      startDate: new Date(ad.startDate),
      endDate: new Date(ad.endDate),
      frequency: ad.frequency,
      isActive: ad.isActive,
      paymentStatus: ad.paymentStatus,
      paymentAmount: ad.paymentAmount,
      createdBy: ad.createdBy,
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.advertiserName || !form.advertiserUrl || !form.mediaUrl) return;
    if (editingAd) {
      await advertisementService.update(editingAd.id, form);
    } else {
      await advertisementService.create(form);
    }
    const updated = await advertisementService.getAll();
    setAds(updated);
    setShowForm(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this advertisement?')) return;
    await advertisementService.delete(id);
    setAds(ads.filter(a => a.id !== id));
  };

  const toggleActive = async (ad: Advertisement) => {
    await advertisementService.update(ad.id, { isActive: !ad.isActive });
    setAds(ads.map(a => a.id === ad.id ? { ...a, isActive: !a.isActive } : a));
  };

  const statusBadge = (ad: Advertisement) => {
    const now = new Date();
    if (!ad.isActive) return { label: 'Paused', cls: 'paused' };
    if (new Date(ad.startDate) > now) return { label: 'Scheduled', cls: 'scheduled' };
    if (new Date(ad.endDate) < now) return { label: 'Expired', cls: 'expired' };
    return { label: 'Live', cls: 'live' };
  };

  const formatDate = (d: Date) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  if (!currentUser?.isAdmin) return null;

  return (
    <div className="admin-ads-page">
      {/* Header */}
      <div className="admin-ads-header">
        <button className="admin-ads-back" onClick={() => navigate('/admin')}>‹</button>
        <h1 className="admin-ads-title">Ad Manager</h1>
        <button className="admin-ads-create-btn" onClick={openCreate}>+ New Ad</button>
      </div>

      {/* Stats row */}
      <div className="admin-ads-stats">
        <div className="ads-stat">
          <span className="ads-stat-value">{ads.filter(a => statusBadge(a).cls === 'live').length}</span>
          <span className="ads-stat-label">Live</span>
        </div>
        <div className="ads-stat">
          <span className="ads-stat-value">{ads.reduce((s, a) => s + a.impressions, 0).toLocaleString()}</span>
          <span className="ads-stat-label">Impressions</span>
        </div>
        <div className="ads-stat">
          <span className="ads-stat-value">{ads.reduce((s, a) => s + a.clicks, 0).toLocaleString()}</span>
          <span className="ads-stat-label">Clicks</span>
        </div>
        <div className="ads-stat">
          <span className="ads-stat-value">
            £{(ads.filter(a => a.paymentStatus === 'paid').reduce((s, a) => s + a.paymentAmount, 0) / 100).toFixed(0)}
          </span>
          <span className="ads-stat-label">Revenue</span>
        </div>
      </div>

      {/* Ads list */}
      <div className="admin-ads-list">
        {loading ? (
          <div className="ads-loading">Loading…</div>
        ) : ads.length === 0 ? (
          <div className="ads-empty">
            <p>No advertisements yet.</p>
            <button className="admin-ads-create-btn" onClick={openCreate}>Create your first ad</button>
          </div>
        ) : (
          ads.map(ad => {
            const badge = statusBadge(ad);
            const ctr = ad.impressions > 0 ? ((ad.clicks / ad.impressions) * 100).toFixed(1) : '0.0';
            return (
              <div key={ad.id} className="ads-card">
                <div className="ads-card-top">
                  {ad.mediaType === 'image' && ad.mediaUrl && (
                    <img src={ad.mediaUrl} alt={ad.title} className="ads-card-thumb" />
                  )}
                  {ad.mediaType === 'video' && (
                    <div className="ads-card-thumb ads-card-thumb-video">
                      {ad.thumbnailUrl ? (
                        <img src={ad.thumbnailUrl} alt={ad.title} />
                      ) : (
                        <span>▶</span>
                      )}
                    </div>
                  )}
                  <div className="ads-card-info">
                    <div className="ads-card-title-row">
                      <p className="ads-card-title">{ad.title}</p>
                      <span className={`ads-badge ads-badge-${badge.cls}`}>{badge.label}</span>
                    </div>
                    <p className="ads-card-advertiser">{ad.advertiserName}</p>
                    <p className="ads-card-dates">{formatDate(ad.startDate)} → {formatDate(ad.endDate)}</p>
                    <div className="ads-card-meta-row">
                      <span>{ad.mediaType === 'video' ? '🎥 Video' : '🖼 Image'}</span>
                      <span>Every {ad.frequency} posts</span>
                      <span>CTR {ctr}%</span>
                      <span className={`ads-pay-${ad.paymentStatus}`}>
                        £{(ad.paymentAmount / 100).toFixed(0)} · {ad.paymentStatus}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="ads-card-stats">
                  <span>{ad.impressions.toLocaleString()} views</span>
                  <span>{ad.clicks.toLocaleString()} clicks</span>
                </div>
                <div className="ads-card-actions">
                  <button className="ads-action-btn" onClick={() => toggleActive(ad)}>
                    {ad.isActive ? 'Pause' : 'Resume'}
                  </button>
                  <button className="ads-action-btn" onClick={() => openEdit(ad)}>Edit</button>
                  <button className="ads-action-btn danger" onClick={() => handleDelete(ad.id)}>Delete</button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Create/Edit Form Modal */}
      {showForm && (
        <div className="ads-modal-overlay" onClick={() => setShowForm(false)}>
          <div className="ads-modal" onClick={e => e.stopPropagation()}>
            <div className="ads-modal-header">
              <h2>{editingAd ? 'Edit Advertisement' : 'New Advertisement'}</h2>
              <button className="ads-modal-close" onClick={() => setShowForm(false)}>✕</button>
            </div>
            <div className="ads-modal-body">

              <div className="ads-form-group">
                <label>Ad Title *</label>
                <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Enter ad title" />
              </div>

              <div className="ads-form-group">
                <label>Description</label>
                <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Optional short description" rows={2} />
              </div>

              <div className="ads-form-row">
                <div className="ads-form-group">
                  <label>Advertiser Name *</label>
                  <input value={form.advertiserName} onChange={e => setForm(p => ({ ...p, advertiserName: e.target.value }))} placeholder="Company name" />
                </div>
                <div className="ads-form-group">
                  <label>Advertiser Website *</label>
                  <input value={form.advertiserUrl} onChange={e => setForm(p => ({ ...p, advertiserUrl: e.target.value }))} placeholder="https://example.com" />
                </div>
              </div>

              <div className="ads-form-group">
                <label>Media Type</label>
                <div className="ads-toggle-row">
                  <button
                    className={`ads-toggle-btn${form.mediaType === 'image' ? ' active' : ''}`}
                    onClick={() => setForm(p => ({ ...p, mediaType: 'image' }))}
                    type="button"
                  >🖼 Image</button>
                  <button
                    className={`ads-toggle-btn${form.mediaType === 'video' ? ' active' : ''}`}
                    onClick={() => setForm(p => ({ ...p, mediaType: 'video' }))}
                    type="button"
                  >🎥 Video</button>
                </div>
              </div>

              <div className="ads-form-group">
                <label>Media URL * <span className="ads-form-hint">(External hosted URL — CDN, YouTube, Vimeo, or direct mp4)</span></label>
                <input value={form.mediaUrl} onChange={e => setForm(p => ({ ...p, mediaUrl: e.target.value }))} placeholder="https://..." />
              </div>

              {form.mediaType === 'video' && (
                <>
                  <div className="ads-form-group">
                    <label>Thumbnail Image URL <span className="ads-form-hint">(optional video preview)</span></label>
                    <input value={form.thumbnailUrl} onChange={e => setForm(p => ({ ...p, thumbnailUrl: e.target.value }))} placeholder="https://..." />
                  </div>
                  <div className="ads-form-group ads-form-check">
                    <input
                      type="checkbox"
                      id="allowFs"
                      checked={form.allowFullscreen}
                      onChange={e => setForm(p => ({ ...p, allowFullscreen: e.target.checked }))}
                    />
                    <label htmlFor="allowFs">Allow fullscreen mode</label>
                  </div>
                </>
              )}

              <div className="ads-form-row">
                <div className="ads-form-group">
                  <label>Start Date *</label>
                  <input
                    type="date"
                    value={new Date(form.startDate).toISOString().split('T')[0]}
                    onChange={e => setForm(p => ({ ...p, startDate: new Date(e.target.value) }))}
                  />
                </div>
                <div className="ads-form-group">
                  <label>End Date *</label>
                  <input
                    type="date"
                    value={new Date(form.endDate).toISOString().split('T')[0]}
                    onChange={e => setForm(p => ({ ...p, endDate: new Date(e.target.value) }))}
                  />
                </div>
              </div>

              <div className="ads-form-group">
                <label>Frequency — show ad every <strong>{form.frequency}</strong> posts</label>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={form.frequency}
                  onChange={e => setForm(p => ({ ...p, frequency: Number(e.target.value) }))}
                  className="ads-range"
                />
                <div className="ads-range-labels"><span>Every post</span><span>Every 10 posts</span></div>
              </div>

              <div className="ads-form-row">
                <div className="ads-form-group">
                  <label>Payment Amount (pence) <span className="ads-form-hint">Stripe — coming soon</span></label>
                  <input
                    type="number"
                    value={form.paymentAmount}
                    onChange={e => setForm(p => ({ ...p, paymentAmount: Number(e.target.value) }))}
                    placeholder="0"
                  />
                </div>
                <div className="ads-form-group">
                  <label>Payment Status</label>
                  <select value={form.paymentStatus} onChange={e => setForm(p => ({ ...p, paymentStatus: e.target.value as Advertisement['paymentStatus'] }))}>
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="ads-form-group ads-form-check">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={form.isActive}
                  onChange={e => setForm(p => ({ ...p, isActive: e.target.checked }))}
                />
                <label htmlFor="isActive">Active (show in feed)</label>
              </div>

            </div>
            <div className="ads-modal-footer">
              <button className="ads-cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
              <button className="ads-save-btn" onClick={handleSave}>
                {editingAd ? 'Save Changes' : 'Create Ad'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAdsPage;
