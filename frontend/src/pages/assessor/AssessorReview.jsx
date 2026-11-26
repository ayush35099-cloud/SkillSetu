import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useOutletContext } from 'react-router-dom';
import { apiService } from '../../services/api';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Award,
  AlertTriangle,
  Play,
  ExternalLink,
  ShieldAlert,
  ShieldCheck,
  User,
  Phone,
  MapPin,
  Clock,
  Sparkles,
  Info,
  Layers,
  FileCheck2,
  Send
} from 'lucide-react';

export default function AssessorReview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isApproved } = useOutletContext();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const [submission, setSubmission] = useState(null);
  const [task, setTask] = useState(null);

  // Form State
  const [scores, setScores] = useState({}); // { [rubric_id]: score_number }
  const [comments, setComments] = useState({}); // { [rubric_id]: comment_string }
  const [overallFeedback, setOverallFeedback] = useState('');
  const [decision, setDecision] = useState('approved'); // 'approved' | 'rejected' | 'resubmission_requested'

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiService.getAssessorSubmission(id);
        if (res.submission) {
          setSubmission(res.submission);
          setTask(res.task);

          // If rubrics exist, initialize default scores
          if (res.task?.rubrics) {
            const initialScores = {};
            const initialComments = {};
            res.task.rubrics.forEach((r) => {
              // Default to 80% score or existing score
              initialScores[r.id] = Math.round(r.max_score * 0.8);
              initialComments[r.id] = '';
            });
            setScores(initialScores);
            setComments(initialComments);
          }

          // If submission already has a review, prefill it
          if (res.submission.latest_review) {
            setDecision(res.submission.latest_review.decision);
            setOverallFeedback(res.submission.latest_review.overall_feedback);
          }
        }
      } catch (err) {
        console.error('Failed to load submission:', err);
        setError(err.message || 'Could not load submission detail');
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  const handleScoreChange = (rubricId, maxScore, value) => {
    const num = parseFloat(value);
    if (isNaN(num)) {
      setScores((prev) => ({ ...prev, [rubricId]: 0 }));
      return;
    }
    const clamped = Math.min(Math.max(0, num), maxScore);
    setScores((prev) => ({ ...prev, [rubricId]: clamped }));
  };

  const handleCommentChange = (rubricId, text) => {
    setComments((prev) => ({ ...prev, [rubricId]: text }));
  };

  const calculateTotal = () => {
    return Object.values(scores).reduce((acc, curr) => acc + (parseFloat(curr) || 0), 0);
  };

  const calculateMaxPossible = () => {
    if (!task?.rubrics) return 100;
    return task.rubrics.reduce((acc, curr) => acc + curr.max_score, 0);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isApproved) {
      alert('Your assessor account is pending admin approval. You cannot submit final decisions until approved.');
      return;
    }

    if (!overallFeedback || overallFeedback.trim().length < 8) {
      alert('Please provide meaningful overall feedback (minimum 8 characters).');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const criteria_scores = task.rubrics.map((r) => ({
        rubric_id: r.id,
        score: scores[r.id] !== undefined ? scores[r.id] : r.max_score,
        comment: comments[r.id] || ''
      }));

      const payload = {
        decision,
        overall_feedback: overallFeedback.trim(),
        criteria_scores
      };

      const res = await apiService.submitReview(id, payload);
      setSuccessMessage(res.message || 'Assessment evaluation submitted successfully.');
      setTimeout(() => {
        navigate('/assessor/submissions');
      }, 1800);
    } catch (err) {
      console.error('Failed to submit review:', err);
      setError(err.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const isVideoUrl = (url) => {
    if (!url) return false;
    return (
      url.includes('youtube.com') ||
      url.includes('youtu.be') ||
      url.endsWith('.mp4') ||
      url.endsWith('.webm')
    );
  };

  const getYoutubeEmbed = (url) => {
    if (!url) return null;
    let videoId = '';
    if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0];
    } else if (url.includes('watch?v=')) {
      videoId = url.split('watch?v=')[1]?.split('&')[0];
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-greygreen dark:text-ivory/60 text-sm flex flex-col items-center justify-center gap-3">
        <RefreshCw className="w-8 h-8 animate-spin text-terracotta" />
        <span>Loading submission evidence and rubrics from PostgreSQL...</span>
      </div>
    );
  }

  if (error && !submission) {
    return (
      <div className="space-y-4">
        <Link
          to="/assessor/submissions"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-teal dark:text-ivory hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Submissions Queue</span>
        </Link>
        <div className="p-6 rounded-3xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">
          {error}
        </div>
      </div>
    );
  }

  const totalScore = calculateTotal();
  const maxScore = calculateMaxPossible();
  const scorePercent = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Top Navigation & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          to="/assessor/submissions"
          className="inline-flex items-center gap-2 text-xs font-bold text-teal dark:text-ivory hover:text-terracotta transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Submissions Queue</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-xs text-greygreen dark:text-ivory/60">
            Submission ID: <strong className="font-mono text-teal dark:text-ivory">#{submission?.id}</strong>
          </span>
          <span className="text-xs text-greygreen dark:text-ivory/60">•</span>
          <span className="text-xs text-greygreen dark:text-ivory/60 capitalize">
            Status: <strong className="text-terracotta">{submission?.status}</strong>
          </span>
        </div>
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500 text-white text-sm font-bold flex items-center gap-3 shadow-md animate-scaleUp">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{successMessage} Redirecting to queue...</span>
        </div>
      )}

      {/* Error Notification */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-500 text-white text-xs font-bold flex items-center gap-3 shadow-md animate-shake">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main 2-Column Evaluation Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ================================================================= */}
        {/* Left Column: Worker Profile & Demonstration Evidence (5 Cols)   */}
        {/* ================================================================= */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Worker Profile Summary Card */}
          <div className="bg-white dark:bg-charcoal-800 rounded-3xl p-6 border border-beige dark:border-charcoal-700 shadow-sm space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-greygreen dark:text-ivory/60">
                  Candidate Craftsperson
                </span>
                <h3 className="text-xl font-black text-teal dark:text-ivory font-heading mt-0.5">
                  {submission?.worker_name}
                </h3>
                <p className="text-xs text-terracotta dark:text-amber-400 font-bold capitalize mt-0.5">
                  {submission?.trade || submission?.worker_trade} Professional
                </p>
              </div>

              <div className="w-12 h-12 rounded-2xl bg-teal dark:bg-charcoal-700 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                {submission?.worker_name ? submission.worker_name[0].toUpperCase() : 'W'}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-beige dark:border-charcoal-700 text-xs">
              <div className="flex items-center gap-2 text-greygreen dark:text-ivory/70">
                <Clock className="w-3.5 h-3.5 text-teal" />
                <span>{submission?.worker_experience || 5} Years Experience</span>
              </div>
              <div className="flex items-center gap-2 text-greygreen dark:text-ivory/70">
                <MapPin className="w-3.5 h-3.5 text-terracotta" />
                <span className="truncate">{submission?.worker_location || 'India'}</span>
              </div>
              <div className="flex items-center gap-2 text-greygreen dark:text-ivory/70">
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>{submission?.worker_phone || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2 text-greygreen dark:text-ivory/70">
                <FileCheck2 className="w-3.5 h-3.5 text-blue-600" />
                <span>ID #{submission?.worker_id}</span>
              </div>
            </div>
          </div>

          {/* Evidence Media Viewer Card */}
          <div className="bg-white dark:bg-charcoal-800 rounded-3xl p-6 border border-beige dark:border-charcoal-700 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-beige dark:border-charcoal-700">
              <div className="flex items-center gap-2">
                <Play className="w-4 h-4 text-terracotta" />
                <h4 className="font-bold text-sm text-teal dark:text-ivory font-heading">
                  Demonstration Evidence
                </h4>
              </div>

              <a
                href={submission?.evidence_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-terracotta hover:underline"
              >
                <span>Direct Link</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Media Player Container */}
            <div className="relative rounded-2xl overflow-hidden bg-black border border-beige dark:border-charcoal-700 aspect-video flex items-center justify-center">
              {isVideoUrl(submission?.evidence_url) ? (
                getYoutubeEmbed(submission?.evidence_url) ? (
                  <iframe
                    src={getYoutubeEmbed(submission?.evidence_url)}
                    title="Demonstration Video"
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video
                    src={submission?.evidence_url}
                    controls
                    className="w-full h-full object-contain"
                  >
                    Your browser does not support HTML5 video.
                  </video>
                )
              ) : (
                <img
                  src={submission?.evidence_url}
                  alt="Practical Demonstration Evidence"
                  className="w-full h-full object-contain bg-charcoal-950"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.pexels.com/photos/31199578/pexels-photo-31199578.jpeg';
                  }}
                />
              )}
            </div>

            {/* Submission Notes */}
            {submission?.submission_notes && (
              <div className="p-4 rounded-2xl bg-sand-50/60 dark:bg-charcoal-900 border border-beige dark:border-charcoal-700 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-greygreen dark:text-ivory/60">
                  Candidate Notes & Procedure Log:
                </span>
                <p className="text-xs text-teal-950 dark:text-ivory leading-relaxed italic">
                  "{submission.submission_notes}"
                </p>
              </div>
            )}
          </div>

          {/* Assessment Task Description Card */}
          <div className="bg-white dark:bg-charcoal-800 rounded-3xl p-6 border border-beige dark:border-charcoal-700 shadow-sm space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-terracotta dark:text-amber-400">
              Benchmark Standard & Protocol
            </span>
            <h4 className="text-base font-bold text-teal dark:text-ivory font-heading">
              {task?.task_title || submission?.task_title}
            </h4>
            <p className="text-xs text-greygreen dark:text-ivory/70 leading-relaxed">
              {task?.task_description}
            </p>

            {task?.safety_instructions && (
              <div className="p-3.5 rounded-2xl bg-amber-500/10 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 text-xs text-amber-950 dark:text-amber-200 leading-relaxed space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>Mandatory Safety Protocol:</span>
                </div>
                <p>{task.safety_instructions}</p>
              </div>
            )}

            {task?.required_tools && (
              <p className="text-[11px] text-greygreen dark:text-ivory/60 pt-1">
                <strong>Standard Tools:</strong> {task.required_tools}
              </p>
            )}
          </div>

        </div>

        {/* ================================================================= */}
        {/* Right Column: Predefined Rubrics Evaluation Form (7 Cols)         */}
        {/* ================================================================= */}
        <div className="lg:col-span-7 space-y-6">
          
          <form onSubmit={handleSubmitReview} className="space-y-6">
            
            {/* Header Evaluation Summary Card */}
            <div className="bg-gradient-to-br from-teal-950 to-teal-900 text-white rounded-3xl p-6 sm:p-7 shadow-lg border border-teal-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                  Predefined Rubric Engine
                </span>
                <h3 className="text-xl sm:text-2xl font-black font-heading mt-0.5 !text-white text-white">
                  Criterion-Wise Assessment
                </h3>
                <p className="text-xs text-ivory/70 mt-1">
                  Score every criterion against demonstrated craftsmanship and safety protocols.
                </p>
              </div>

              {/* Dynamic Score Display */}
              <div className="p-4 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-xs text-center shrink-0 min-w-36">
                <span className="text-2xl sm:text-3xl font-black text-amber-300 font-heading">
                  {totalScore}
                </span>
                <span className="text-xs text-ivory/60"> / {maxScore}</span>
                <span className="block text-[11px] font-bold text-emerald-300 mt-0.5">
                  {scorePercent}% Composite
                </span>
              </div>
            </div>

            {/* Rubrics Criteria List */}
            <div className="space-y-4">
              {task?.rubrics?.map((rubric, idx) => {
                const currentScore = scores[rubric.id] !== undefined ? scores[rubric.id] : 0;
                return (
                  <div
                    key={rubric.id}
                    className="bg-white dark:bg-charcoal-800 rounded-3xl p-5 sm:p-6 border border-beige dark:border-charcoal-700 shadow-sm space-y-4 hover:border-teal/30 transition-all"
                  >
                    {/* Criterion Title */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 pb-3 border-b border-beige dark:border-charcoal-700">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-teal text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                            {idx + 1}
                          </span>
                          <h4 className="font-bold text-teal dark:text-ivory text-sm sm:text-base font-heading">
                            {rubric.criterion_name}
                          </h4>
                        </div>
                        {rubric.criterion_description && (
                          <p className="text-xs text-greygreen dark:text-ivory/70 pl-7 leading-relaxed">
                            {rubric.criterion_description}
                          </p>
                        )}
                      </div>

                      <span className="self-end sm:self-auto text-xs font-bold text-greygreen dark:text-ivory/60 bg-sand-100 dark:bg-charcoal-700 px-2.5 py-1 rounded-full whitespace-nowrap">
                        Max: {rubric.max_score} pts
                      </span>
                    </div>

                    {/* Numeric Score Input & Preset Buttons */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                      
                      <div className="sm:col-span-5 flex items-center gap-3">
                        <label className="text-xs font-bold text-teal dark:text-ivory">
                          Score:
                        </label>
                        <input
                          type="number"
                          min="0"
                          max={rubric.max_score}
                          step="0.5"
                          value={currentScore}
                          onChange={(e) => handleScoreChange(rubric.id, rubric.max_score, e.target.value)}
                          className="w-24 px-3 py-2 rounded-xl bg-sand-50/80 dark:bg-charcoal-900 border border-beige dark:border-charcoal-600 text-teal dark:text-ivory font-bold text-sm text-center focus:ring-2 focus:ring-terracotta"
                        />
                        <span className="text-xs text-greygreen dark:text-ivory/60">
                          / {rubric.max_score}
                        </span>
                      </div>

                      {/* Quick Percentage Presets */}
                      <div className="sm:col-span-7 flex items-center gap-1.5 justify-start sm:justify-end">
                        {[
                          { label: 'Full', frac: 1.0 },
                          { label: '90%', frac: 0.9 },
                          { label: '75%', frac: 0.75 },
                          { label: '50%', frac: 0.5 },
                        ].map((preset) => (
                          <button
                            key={preset.label}
                            type="button"
                            onClick={() => handleScoreChange(rubric.id, rubric.max_score, Math.round(rubric.max_score * preset.frac))}
                            className="px-2.5 py-1 rounded-lg bg-sand-100 dark:bg-charcoal-700 hover:bg-sand-200 text-teal dark:text-ivory text-[11px] font-bold transition-colors"
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>

                    </div>

                    {/* Evaluator Observation Note per Criterion */}
                    <div>
                      <input
                        type="text"
                        placeholder={`Assessor observation for criterion #${idx + 1} (optional)...`}
                        value={comments[rubric.id] || ''}
                        onChange={(e) => handleCommentChange(rubric.id, e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-sand-50/60 dark:bg-charcoal-900 border border-beige dark:border-charcoal-600 text-xs text-teal dark:text-ivory placeholder:text-greygreen/50 focus:outline-hidden focus:ring-1 focus:ring-terracotta"
                      />
                    </div>

                  </div>
                );
              })}
            </div>

            {/* Assessment Decision Selector Card */}
            <div className="bg-white dark:bg-charcoal-800 rounded-3xl p-6 border border-beige dark:border-charcoal-700 shadow-sm space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-greygreen dark:text-ivory/60">
                Final Evaluation Decision:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                
                {/* Approve Option */}
                <button
                  type="button"
                  onClick={() => setDecision('approved')}
                  className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between gap-3 ${
                    decision === 'approved'
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 ring-2 ring-emerald-500/30'
                      : 'border-beige dark:border-charcoal-600 bg-white dark:bg-charcoal-700/40 text-greygreen hover:border-emerald-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <CheckCircle2 className={`w-5 h-5 ${decision === 'approved' ? 'text-emerald-600 dark:text-emerald-400' : 'text-greygreen'}`} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Pass Benchmark</span>
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-teal dark:text-ivory">Approve</h5>
                    <p className="text-[11px] text-greygreen dark:text-ivory/60 mt-0.5">
                      Candidate meets or exceeds professional trade criteria.
                    </p>
                  </div>
                </button>

                {/* Request Resubmission Option */}
                <button
                  type="button"
                  onClick={() => setDecision('resubmission_requested')}
                  className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between gap-3 ${
                    decision === 'resubmission_requested'
                      ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/40 text-orange-950 dark:text-orange-100 ring-2 ring-orange-500/30'
                      : 'border-beige dark:border-charcoal-600 bg-white dark:bg-charcoal-700/40 text-greygreen hover:border-orange-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <RefreshCw className={`w-5 h-5 ${decision === 'resubmission_requested' ? 'text-orange-600 dark:text-orange-400' : 'text-greygreen'}`} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Need Corrections</span>
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-teal dark:text-ivory">Request Resubmission</h5>
                    <p className="text-[11px] text-greygreen dark:text-ivory/60 mt-0.5">
                      Minor defects; worker may record and submit revised demonstration.
                    </p>
                  </div>
                </button>

                {/* Reject Option */}
                <button
                  type="button"
                  onClick={() => setDecision('rejected')}
                  className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between gap-3 ${
                    decision === 'rejected'
                      ? 'border-red-500 bg-red-50 dark:bg-red-950/40 text-red-950 dark:text-red-100 ring-2 ring-red-500/30'
                      : 'border-beige dark:border-charcoal-600 bg-white dark:bg-charcoal-700/40 text-greygreen hover:border-red-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <XCircle className={`w-5 h-5 ${decision === 'rejected' ? 'text-red-600 dark:text-red-400' : 'text-greygreen'}`} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Did Not Pass</span>
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-teal dark:text-ivory">Reject</h5>
                    <p className="text-[11px] text-greygreen dark:text-ivory/60 mt-0.5">
                      Fails safety requirements or critical craft standards.
                    </p>
                  </div>
                </button>

              </div>
            </div>

            {/* Overall Assessor Feedback Field */}
            <div className="bg-white dark:bg-charcoal-800 rounded-3xl p-6 border border-beige dark:border-charcoal-700 shadow-sm space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-teal dark:text-ivory font-heading">
                Comprehensive Assessor Feedback (Required):
              </label>
              <textarea
                rows="4"
                placeholder="Detail technical strengths, tool technique observations, areas for improvement, and reasoning for your final decision..."
                value={overallFeedback}
                onChange={(e) => setOverallFeedback(e.target.value)}
                required
                className="w-full p-4 rounded-2xl bg-sand-50/60 dark:bg-charcoal-900 border border-beige dark:border-charcoal-600 text-xs sm:text-sm text-teal dark:text-ivory placeholder:text-greygreen/50 focus:ring-2 focus:ring-terracotta leading-relaxed"
              />
              <p className="text-[11px] text-greygreen dark:text-ivory/60">
                This feedback is displayed directly to the worker in their SkillSetu portal to facilitate vocational growth.
              </p>
            </div>

            {/* Submission Button Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <div className="text-xs text-greygreen dark:text-ivory/60">
                {isApproved ? (
                  <span className="inline-flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-bold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Authorized to submit binding assessment decisions</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-bold">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Submission disabled: Assessor account awaiting admin approval</span>
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting || !isApproved}
                className={`inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-sm shadow-md transition-all ${
                  !isApproved
                    ? 'bg-greygreen/40 text-white cursor-not-allowed'
                    : 'bg-terracotta hover:bg-terracotta-600 text-white shadow-terracotta/20 active:scale-95'
                }`}
              >
                {submitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Saving to PostgreSQL...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Official Evaluation Decision</span>
                  </>
                )}
              </button>
            </div>

          </form>

        </div>

      </div>

    </div>
  );
}
