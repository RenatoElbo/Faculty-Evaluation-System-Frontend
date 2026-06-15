async function fetchFromAPI(endpoint: string) {
    const response = await fetch(`/ifes/${endpoint}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
    }

    return await response.json();
}

async function sendToAPI(
    endpoint: string,
    method: "POST" | "PUT" | "DELETE",
    body?: any
) {
    const response = await fetch(`/ifes/${endpoint}`, {
        method,
        headers: {
            "Content-Type": "application/json",
        },
        body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
    }

    return await response.json();
}


export const getDashboardData = () => fetchFromAPI("get-dashboard-data");
export const getPreviousSemesters = () => fetchFromAPI("get-previous-semesters");
export const getSectionListAdmin = () => fetchFromAPI("get-section-list");
export const getDeanList = () => fetchFromAPI("get-dean-list");
export const getFacultyList = (column: string, direction: string) => fetchFromAPI(`get-faculties-lists/${column}/${direction}`);

export const updateDean = (id: number, dean: string) => sendToAPI(`add-dean`, "POST", { id, dean });

export const addFaculty = (faculty: string, academic_rank: string, status: string, section_handle: any[], subject_handle: any[]) => 
    sendToAPI("add-faculty", "POST", { faculty, academic_rank, status, section_handle, subject_handle });
export const updateFaculty = (id: number, faculty: string, academic_rank: string, status: string, section_handle: any[], subject_handle: any[]) => 
    sendToAPI(`update-faculty/${id}`, "PUT", { faculty, academic_rank, status, section_handle, subject_handle });
export const deleteFaculty = (id: number) => sendToAPI(`remove-faculty/${id}`, "DELETE");

export const addSemester = (semester: string) => sendToAPI("add-semester", "POST", { semester });
export const removeSemester = (id: number) => sendToAPI(`delete-semester/${id}`, "PUT");
export const addSection = (section: string) => sendToAPI("add-section", "POST", { section });
export const removeSection = (id: number) => sendToAPI(`delete-section/${id}`, "DELETE");

export const getSemesterList = () => fetchFromAPI("get-semester-list");
export const getEvaluationResults = (semester: string | null) => sendToAPI(`get-evaluation-results`, "POST", { semester: semester ?? null});
