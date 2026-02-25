import { Program } from "../types";

const MEETING_DURATION_MS = 60 * 60 * 1000;

export const isMeetingEnded = (program: Program, now: Date) => {
  const start = new Date(program.session_date);
  const end = new Date(start.getTime() + MEETING_DURATION_MS);
  return program.session_status === "completed" || now >= end;
};

export const isMeetingStarted = (program: Program, now: Date) => {
  const start = new Date(program.session_date);
  return now >= start;
};

export const getRemainingTimeLabel = (program: Program, now: Date) => {
  const start = new Date(program.session_date);
  const end = new Date(start.getTime() + MEETING_DURATION_MS);
  const ended = isMeetingEnded(program, now);
  const ongoing = now >= start && now < end;

  if (ended) return "N/A";
  if (ongoing) return "Ongoing";

  const diffMs = start.getTime() - now.getTime();
  const totalMinutes = Math.max(0, Math.floor(diffMs / (1000 * 60)));
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};
