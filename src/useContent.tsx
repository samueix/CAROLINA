import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { 
  PERSONAL_INFO, 
  EXPERIENCES, 
  EDUCATION_LIST, 
  COURSES_LIST, 
  SKILLS_LIST 
} from './data';
import { Experience, Education, Course, Skill } from './types';

export const STORAGE_KEY = 'carol_content_override';

export interface ContentOverride {
  personal?: Partial<typeof PERSONAL_INFO>;
  experiences?: Experience[];
  education?: Education[];
  courses?: Course[];
  skills?: Skill[];
}

interface ContentContextType {
  personal: typeof PERSONAL_INFO;
  experiences: Experience[];
  education: Education[];
  courses: Course[];
  skills: Skill[];
  override: ContentOverride;
  setContent: (newOverride: ContentOverride | ((prev: ContentOverride) => ContentOverride)) => void;
  resetContent: () => void;
}

const ContentContext = createContext<ContentContextType | null>(null);

function loadStoredOverride(): ContentOverride {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      return parsed;
    }
  } catch (err) {
    console.error('Erro ao ler carol_content_override do localStorage:', err);
  }
  return {};
}

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [override, setOverrideState] = useState<ContentOverride>(() => loadStoredOverride());

  const syncFromStorage = useCallback(() => {
    setOverrideState(loadStoredOverride());
  }, []);

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        syncFromStorage();
      }
    };
    const handleCustomSync = () => {
      syncFromStorage();
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('carol_content_updated', handleCustomSync);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('carol_content_updated', handleCustomSync);
    };
  }, [syncFromStorage]);

  const setContent = useCallback((updater: ContentOverride | ((prev: ContentOverride) => ContentOverride)) => {
    setOverrideState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        window.dispatchEvent(new CustomEvent('carol_content_updated'));
      } catch (err) {
        console.error('Erro ao gravar carol_content_override no localStorage:', err);
      }
      return next;
    });
  }, []);

  const resetContent = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setOverrideState({});
      window.dispatchEvent(new CustomEvent('carol_content_updated'));
    } catch (err) {
      console.error('Erro ao resetar carol_content_override:', err);
    }
  }, []);

  const mergedPersonal = useMemo(() => {
    return {
      ...PERSONAL_INFO,
      ...(override.personal || {})
    };
  }, [override.personal]);

  const mergedExperiences = useMemo(() => {
    return override.experiences && override.experiences.length > 0
      ? override.experiences
      : EXPERIENCES;
  }, [override.experiences]);

  const mergedEducation = useMemo(() => {
    return override.education && override.education.length > 0
      ? override.education
      : EDUCATION_LIST;
  }, [override.education]);

  const mergedCourses = useMemo(() => {
    return override.courses && override.courses.length > 0
      ? override.courses
      : COURSES_LIST;
  }, [override.courses]);

  const mergedSkills = useMemo(() => {
    return override.skills && override.skills.length > 0
      ? override.skills
      : SKILLS_LIST;
  }, [override.skills]);

  const value = useMemo(() => ({
    personal: mergedPersonal,
    experiences: mergedExperiences,
    education: mergedEducation,
    courses: mergedCourses,
    skills: mergedSkills,
    override,
    setContent,
    resetContent
  }), [
    mergedPersonal,
    mergedExperiences,
    mergedEducation,
    mergedCourses,
    mergedSkills,
    override,
    setContent,
    resetContent
  ]);

  return (
    <ContentContext.Provider value={value}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent(): ContentContextType {
  const context = useContext(ContentContext);
  if (!context) {
    // Fallback safe defaults if used outside provider
    return {
      personal: PERSONAL_INFO,
      experiences: EXPERIENCES,
      education: EDUCATION_LIST,
      courses: COURSES_LIST,
      skills: SKILLS_LIST,
      override: {},
      setContent: () => {},
      resetContent: () => {}
    };
  }
  return context;
}
