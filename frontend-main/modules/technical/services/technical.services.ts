

export const fetchCategories = async (): Promise<string[]> => {
	// Example: return axios.get('/technical/categories').then(r=>r.data)
	return Promise.resolve(["Software Development", "Design", "QA & Testing", "DevOps"])
}

export const fetchSubcategories = async (categoryIds: string[] = []): Promise<string[]> => {
	// Here we'd pass categoryIds to server to fetch related subcategories
	const map: Record<string, string[]> = {
		"Software Development": ["Frontend", "Backend", "Fullstack"],
		"Design": ["UI/UX", "Graphic Design"],
		"QA & Testing": ["Automation", "Manual Testing"],
		"DevOps": ["SRE", "CI/CD"],
	}

	const results = new Set<string>()
	categoryIds.forEach((c) => {
		const arr = map[c]
		if (arr) arr.forEach((s) => results.add(s))
	})
	// If nothing selected, return a default set
	if (results.size === 0) return ["General"]
	return Array.from(results)
}

export const fetchSkills = async (subcategories: string[] = []): Promise<string[]> => {
	const map: Record<string, string[]> = {
		Frontend: ["React", "TypeScript", "HTML", "CSS"],
		Backend: ["Node.js", "Express", "Postgres"],
		Fullstack: ["React", "Node.js"],
		"UI/UX": ["Figma", "Sketch"],
		"Graphic Design": ["Photoshop", "Illustrator"],
		Automation: ["Selenium", "Cypress"],
		"Manual Testing": ["Test Plan", "Test Cases"],
		SRE: ["Kubernetes", "Prometheus"],
		"CI/CD": ["Jenkins", "GitHub Actions"],
	}

	const results = new Set<string>()
	subcategories.forEach((s) => {
		const arr = map[s]
		if (arr) arr.forEach((sk) => results.add(sk))
	})

	if (results.size === 0) return ["Communication", "Project Management"]
	return Array.from(results)
}

export const createProject = async (payload: unknown) => {
	// Replace with an actual POST to backend
	// return axios.post('/technical/projects', payload).then(r=>r.data)
	return Promise.resolve({ success: true, payload })
}

