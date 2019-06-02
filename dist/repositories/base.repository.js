"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
class BaseMongoRepository extends typeorm_1.Repository {
    constructor() {
        super(...arguments);
        this.findBy = (id) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.findOne(id);
            return result;
        });
        this.findByIds = (ids) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.findByIds(ids);
            return result;
        });
    }
}
exports.BaseMongoRepository = BaseMongoRepository;
//# sourceMappingURL=base.repository.js.map