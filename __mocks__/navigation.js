module.exports = {
    useParams() {
        return { id: "1" };
    },

    useRouter() {
        return {
            push: jest.fn(),
            replace: jest.fn(),
            refresh: jest.fn(),
            back: jest.fn(),
            forward: jest.fn(),
            prefetch: jest.fn(),
        };
    },

    useSearchParams() {
        return {
            get: jest.fn(),
        };
    }
};