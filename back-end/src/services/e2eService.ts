import { resetBd } from '../repositories/e2eRepository.js';

export async function truncate() {
    await resetBd();
}
