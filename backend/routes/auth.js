router.delete('/:id', protect, authorize('admin'), handler);
router.post('/',      protect, authorize('admin','volunteer'), handler);
router.get('/',       protect, handler); // all roles