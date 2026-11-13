import json
import unittest
from pathlib import Path

DATA = json.loads((Path(__file__).resolve().parents[1] / 'app' / 'players.json').read_text())

class DataIntegrityTests(unittest.TestCase):
    def test_rankings(self):
        self.assertEqual(len(DATA), 20)
        for category in ('Batter', 'Bowler'):
            subset = [p for p in DATA if p['kind'] == category]
            self.assertEqual(sorted(p['rank'] for p in subset), list(range(1, 11)))
    def test_metrics(self):
        for p in DATA:
            self.assertGreaterEqual(p['balls'], 0)
            self.assertGreaterEqual(p['ipl'], 0)
            self.assertGreaterEqual(p['consistency'], 0)
            self.assertLessEqual(p['consistency'], 100)

if __name__ == '__main__': unittest.main()
