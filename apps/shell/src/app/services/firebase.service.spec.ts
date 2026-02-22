jest.mock('firebase/app', () => ({ initializeApp: jest.fn() }));
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({ currentUser: null, onAuthStateChanged: jest.fn() })),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  setPersistence: jest.fn().mockResolvedValue(undefined),
  browserLocalPersistence: {}
}));
jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  doc: jest.fn(),
  setDoc: jest.fn(),
  getDoc: jest.fn(),
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  getDocs: jest.fn(),
  addDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn()
}));
jest.mock('firebase/analytics', () => ({ getAnalytics: jest.fn() }));

import { FirebaseService } from './firebase.service';

describe('FirebaseService', () => {
  let service: FirebaseService;

  beforeEach(() => {
    service = new FirebaseService();
    service.auth = { currentUser: null, onAuthStateChanged: jest.fn() } as any;
  });

  test('getCurrentUser returns auth.currentUser', () => {
    service.auth.currentUser = { uid: 'test' } as any;
    expect(service.getCurrentUser()).toEqual({ uid: 'test' });
  });

  test('waitForUser resolves immediately if user exists', async () => {
    service.auth.currentUser = { uid: 'u1' } as any;
    const user = await service.waitForUser();
    expect(user).toEqual({ uid: 'u1' });
  });
});
