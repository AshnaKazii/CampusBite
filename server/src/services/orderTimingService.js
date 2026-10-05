exports.calculateEstimatedReadyTime = (items) => {
    // Find the max preparation time among items
    let maxPrepTime = 0;

    items.forEach(item => {
        if (item.preparationTime > maxPrepTime) {
            maxPrepTime = item.preparationTime;
        }
    });

    // Small queue buffer (e.g., 2 minutes base)
    const queueBuffer = 2;
    const totalMinutes = maxPrepTime + queueBuffer;

    const estimatedReadyTime = new Date();
    estimatedReadyTime.setMinutes(estimatedReadyTime.getMinutes() + totalMinutes);

    return { estimatedReadyTime, totalMinutes };
};
