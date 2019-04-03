// Taken fromm https://github.com/sourcegraph/sourcegraph/pull/2557/files
let id = 1

const renderMermaidCharts = () => {
    const pres = document.querySelectorAll('pre[lang=mermaid]')
    for (const pre of pres) {
        const el = pre
        if (el.style.display === 'none') {
            // already rendered
            continue
        }
        el.style.display = 'none'
        const chartDefinition = pre.getElementsByTagName('code')[0].textContent || ''
        const chartID = `mermaid_${id++}`
        mermaid.mermaidAPI.render(chartID, chartDefinition, svg => el.insertAdjacentHTML('afterend', svg))
    }
}

// Render mermaid charts async and debounce the rendering
// to minimize impact on page load.
let timeout = undefined;
const handleDomChange = () => {
    clearTimeout(timeout)
    // Need to use window.setTimeout because:
    // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/21310#issuecomment-367919251
    timeout = window.setTimeout(() => renderMermaidCharts(), 200)
}

const observer = new MutationObserver(() => handleDomChange())
observer.observe(document.body, { subtree: true, childList: true })
handleDomChange()
