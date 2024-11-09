const getDuration = (start_date, end_date) => {
    
    const date_start = new Date(start_date);
    const date_end = new Date(end_date);
    
    let yearStart = date_start.getFullYear();
    let monthStart = date_start.getMonth();
    let dateStart = date_start.getDate();

    let yearEnd = date_end.getFullYear();
    let monthEnd = date_end.getMonth();
    let dateEnd = date_end.getDate();

    let duration = ''
    
    if (yearEnd !== yearStart) {
        const yearDiff = yearEnd - yearStart;
        duration = `${yearDiff} tahun`;
    } else if (monthEnd !== monthStart) {
        const monthDiff = monthEnd - monthStart;
        duration = `${monthDiff} bulan`;
    } else if (dateEnd !== dateStart) {
        const dayDiff = dateEnd - dateStart;
        duration = `${dayDiff} hari`;
    } else {
        duration = '0 hari';
    }
    
    // console.log(`Durasi: ${duration}`);

    return duration;
}

const calculateDuration = (start_, end_) => {
    const start_date = new Date(start_);
    const end_date = new Date(end_);
    const durInDays = (end_date - start_date) / (1000 * 60 * 60 *24);

    if(durInDays > 30){
        const months = Math.floor(durInDays / 30);
        const days = Math.floor(durInDays % 30);
        return `${months} bulan ${days} hari`
    } else {
        return `${durInDays} hari`
    }
};

module.exports = {getDuration, calculateDuration};