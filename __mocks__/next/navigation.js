// __mocks__/next/navigation.js

export const useRouter = () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
});

export const useParams = () => ({ id: "1" });

export const redirect = jest.fn();