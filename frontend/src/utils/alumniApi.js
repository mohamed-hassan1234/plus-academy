import { apiUrl, fetchJson } from "./api";

const ALUMNI_STORAGE_KEY = "plusacademy_alumni_fallback";
const LEGACY_ALUMNI_STORAGE_KEY = "elivate_alumni_fallback";

const getStoredAlumni = () => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw =
      window.localStorage.getItem(ALUMNI_STORAGE_KEY) ??
      window.localStorage.getItem(LEGACY_ALUMNI_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Error reading alumni fallback storage:", error);
    return [];
  }
};

const saveStoredAlumni = (alumni) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(ALUMNI_STORAGE_KEY, JSON.stringify(alumni));
  window.localStorage.removeItem(LEGACY_ALUMNI_STORAGE_KEY);
};

const sortByCreatedAtDesc = (items) =>
  [...items].sort((first, second) => {
    const firstTime = new Date(first.createdAt || 0).getTime();
    const secondTime = new Date(second.createdAt || 0).getTime();
    return secondTime - firstTime;
  });

const mergeAlumni = (apiItems, localItems) => {
  const seen = new Set();
  const merged = [];

  [...localItems, ...apiItems].forEach((item) => {
    const key = item._id || `${item.name}-${item.createdAt || ""}`;

    if (!seen.has(key)) {
      seen.add(key);
      merged.push(item);
    }
  });

  return sortByCreatedAtDesc(merged);
};

const shouldUseFallback = (error) => {
  const message = String(error?.message || "");

  return (
    message.includes("API endpoint not found") ||
    message.includes("Failed to fetch") ||
    message.includes("Unexpected server response") ||
    message.includes("Could not save alumni") ||
    message.includes("Could not delete alumni") ||
    message.includes("Error fetching alumni") ||
    message.includes("Error creating alumni") ||
    message.includes("Error updating alumni") ||
    message.includes("Error deleting alumni") ||
    message.includes("Alumni not found") ||
    message.includes("requires authentication")
  );
};

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Could not read image file."));
    reader.readAsDataURL(file);
  });

const parseJsonResponse = async (response) => {
  const contentType = response.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    throw new Error(
      response.status === 404
        ? "API endpoint not found. Make sure the backend server is running and the latest alumni routes are available."
        : `Unexpected server response (${response.status}).`
    );
  }

  return response.json();
};

export async function fetchAlumniCollection() {
  const localItems = getStoredAlumni();

  try {
    const { response, data } = await fetchJson("/api/alumni");

    if (response.ok && data.success) {
      return {
        data: mergeAlumni(data.data || [], localItems),
        source: "api",
      };
    }
  } catch (error) {
    if (shouldUseFallback(error)) {
      return {
        data: sortByCreatedAtDesc(localItems),
        source: "local",
      };
    }

    throw error;
  }

  return {
    data: sortByCreatedAtDesc(localItems),
    source: "local",
  };
}

export async function createAlumniEntry(formData, imageFile) {
  const payload = new FormData();
  payload.append("name", formData.name);
  payload.append("role", formData.role);
  payload.append("course", formData.course);

  if (imageFile) {
    payload.append("image", imageFile);
  }

  try {
    const response = await fetch(apiUrl("/api/alumni"), {
      method: "POST",
      body: payload,
    });
    const data = await parseJsonResponse(response);

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Could not save alumni.");
    }

    return {
      data: data.data,
      source: "api",
    };
  } catch (error) {
    if (!shouldUseFallback(error)) {
      throw error;
    }

    if (!imageFile) {
      throw new Error("Please upload an image file.");
    }

    const image = await readFileAsDataUrl(imageFile);
    const current = getStoredAlumni();
    const now = new Date().toISOString();
    const created = {
      _id: `local-${Date.now()}`,
      name: formData.name,
      role: formData.role,
      course: formData.course,
      image,
      createdAt: now,
      updatedAt: now,
      isLocalFallback: true,
    };

    saveStoredAlumni(sortByCreatedAtDesc([created, ...current]));

    return {
      data: created,
      source: "local",
    };
  }
}

export async function updateAlumniEntry(id, formData, imageFile, currentImage) {
  if (String(id).startsWith("local-")) {
    const current = getStoredAlumni();
    const nextImage = imageFile ? await readFileAsDataUrl(imageFile) : currentImage;
    const updatedItems = current.map((item) =>
      item._id === id
        ? {
            ...item,
            name: formData.name,
            role: formData.role,
            course: formData.course,
            image: nextImage,
            updatedAt: new Date().toISOString(),
            isLocalFallback: true,
          }
        : item
    );

    saveStoredAlumni(updatedItems);

    return {
      data: updatedItems.find((item) => item._id === id),
      source: "local",
    };
  }

  const payload = new FormData();
  payload.append("name", formData.name);
  payload.append("role", formData.role);
  payload.append("course", formData.course);

  if (imageFile) {
    payload.append("image", imageFile);
  }

  try {
    const response = await fetch(apiUrl(`/api/alumni/${id}`), {
      method: "PUT",
      body: payload,
    });
    const data = await parseJsonResponse(response);

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Could not save alumni.");
    }

    return {
      data: data.data,
      source: "api",
    };
  } catch (error) {
    if (!shouldUseFallback(error)) {
      throw error;
    }

    const current = getStoredAlumni();
    const nextImage = imageFile ? await readFileAsDataUrl(imageFile) : currentImage;
    const updatedItems = current.map((item) =>
      item._id === id
        ? {
            ...item,
            name: formData.name,
            role: formData.role,
            course: formData.course,
            image: nextImage,
            updatedAt: new Date().toISOString(),
            isLocalFallback: true,
          }
        : item
    );

    saveStoredAlumni(updatedItems);

    return {
      data: updatedItems.find((item) => item._id === id),
      source: "local",
    };
  }
}

export async function deleteAlumniEntry(id) {
  if (String(id).startsWith("local-")) {
    const current = getStoredAlumni();
    saveStoredAlumni(current.filter((item) => item._id !== id));

    return {
      source: "local",
    };
  }

  try {
    const { response, data } = await fetchJson(`/api/alumni/${id}`, {
      method: "DELETE",
    });

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Could not delete alumni.");
    }

    return {
      source: "api",
    };
  } catch (error) {
    if (!shouldUseFallback(error)) {
      throw error;
    }

    const current = getStoredAlumni();
    saveStoredAlumni(current.filter((item) => item._id !== id));

    return {
      source: "local",
    };
  }
}
