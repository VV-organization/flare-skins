import test from "node:test";
import assert from "node:assert/strict";
import { parseAmount, dropsToRub, rubToDrops, steamQuote, sumPrices } from "../src/lib/money.ts";

test("парсер: десятичный ввод без потери копеек", () => {
  assert.equal(parseAmount("1 000,50"), 100050);
  assert.equal(parseAmount("0.01"), 1);
  for (const value of ["", "-1", "NaN", "Infinity", "1e8", "1.001", "9".repeat(30)]) assert.equal(parseAmount(value), null);
});
test("курс 1 ₽ = 1,8 Drops в обе стороны", () => {
  assert.equal(rubToDrops(100), 180);
  assert.equal(rubToDrops(100000), 180000);
  assert.equal(dropsToRub(180000), 100000);
  assert.equal(dropsToRub(100000), 55556);
  assert.equal(dropsToRub(1), 1);
  assert.equal(rubToDrops(1), 2);
  assert.equal(dropsToRub(0), 0);
  assert.throws(() => dropsToRub(-1));
});
test("Steam 5% сверху, округление справочной котировки половина вверх", () => {
  assert.deepEqual(steamQuote(100000), { amount:100000, fee:5000, total:105000 });
  assert.deepEqual(steamQuote(250000), { amount:250000, fee:12500, total:262500 });
  assert.deepEqual(steamQuote(10), { amount:10, fee:1, total:11 });
  assert.throws(() => steamQuote(-1));
});
test("итог переводит общую сумму Drops с единственным округлением", () => {
  assert.deepEqual(sumPrices([1,1]), { drops:2, rub:1 });
  assert.deepEqual(sumPrices([100,200]), { drops:300, rub:167 });
});
