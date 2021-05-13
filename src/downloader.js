export function downloadMultipleFilesOnBrowser(urls, intervalMs=300) {
    var interval = setInterval(download, intervalMs, urls);
    function download() {
        var url = urls.pop();
        var a = document.createElement("a");
        a.setAttribute('href', url);
        a.setAttribute('download', '');
        a.setAttribute('target', '_blank');
        a.click();

        if (urls.length == 0) {
            clearInterval(interval);
        }
    }
}

export function driveIdToDownloadURL(driveId){
    return `https://drive.google.com/uc?export=download&id=${driveId}`
}
  
  