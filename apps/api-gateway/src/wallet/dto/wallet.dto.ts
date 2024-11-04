import { ClassValidator } from '@app/utils/ClassValidator';
import { ApiProperty } from '@nestjs/swagger';
import { plainToInstance, Type } from 'class-transformer';
import { IsInstance, IsNumber, IsString } from 'class-validator';

export class Payload {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiJ9.eyJwYXlsb2FkIjoiYmMwODEwODI2YmIzMmYyMmMyMGQ5OTYzNGFhM2ViMWM1ZDg2OGMzM2ZmODJmMWY3ZWMzMDE1N2I5MDA4NDdlMyIsImlhdCI6MTczMDcwNDA0MiwiZXhwIjoxNzMwNzA0OTQyfQ.LujjRO9zHu8xCnqLZLKhZ_pR8PG6129dL1MehtyL13A',
  })
  @IsString()
  payload!: string;

  static async from(params: InstanceType<typeof Payload>) {
    const instance = plainToInstance(this, {
      ...params,
    });

    await ClassValidator.validate(instance);

    return instance;
  }
}

export class Domain {
  @ApiProperty({
    example: 21,
  })
  @IsNumber()
  lengthBytes!: number;

  @ApiProperty({
    example: 'localhost:3000',
  })
  @IsString()
  value!: string;
}

export class TonProof {
  @ApiProperty({
    example: 1730704057,
  })
  @IsNumber()
  timestamp!: number;

  @ApiProperty({ type: Domain })
  @Type(() => Domain)
  domain!: Domain;

  @ApiProperty({
    example:
      'Als2EvxZ8EAJD2ELlD40CuOaQu9Q8LDasHujJjSp7725DdF35agrrWQlwToWdKYzz0zYFa8M18LqfnFxZJOcBg==',
  })
  @IsString()
  signature!: string;

  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiJ9.eyJwYXlsb2FkIjoiYmMwODEwODI2YmIzMmYyMmMyMGQ5OTYzNGFhM2ViMWM1ZDg2OGMzM2ZmODJmMWY3ZWMzMDE1N2I5MDA4NDdlMyIsImlhdCI6MTczMDcwNDA0MiwiZXhwIjoxNzMwNzA0OTQyfQ.LujjRO9zHu8xCnqLZLKhZ_pR8PG6129dL1MehtyL13A',
  })
  @IsString()
  payload!: string;

  @ApiProperty({
    example:
      'te6ccsECFgEAArEAAAUAEgAXABwAjgCTAJgAnQCsALsAwADOANkA6ADsAP4BdAH0AkECfAKGArECATQBFQEU/wD0pBP0vPLICwICASADDgIBSAQFAtzQINdJwSCRW49jINcLHyCCEGV4dG69IYIQc2ludL2wkl8D4IIQZXh0brqOtIAg1yEB0HTXIfpAMPpE+Cj6RDBYvZFb4O1E0IEBQdch9AWDB/QOb6ExkTDhgEDXIXB/2zzgMSDXSYECgLmRMOBw4hEQAgEgBg0CASAHCgIBbggJABmtznaiaEAg65Drhf/AABmvHfaiaEAQ65DrhY/AAgFICwwAF7Ml+1E0HHXIdcLH4AARsmL7UTQ1woAgABm+Xw9qJoQICg65D6AsAQLyDwEeINcLH4IQc2lnbrry4Ip/EAHmjvDtou37IYMI1yICgwjXIyCAINch0x/TH9Mf7UTQ0gDTHyDTH9P/1woACvkBQMz5EJoolF8K2zHh8sCH3wKzUAew8tCEUSW68uCFUDa68uCG+CO78tCIIpL4AN4BpH/IygDLHwHPFsntVCCS+A/ecNs82BED9u2i7fsC9AQhbpJsIY5MAiHXOTBwlCHHALOOLQHXKCB2HkNsINdJwAjy4JMg10rAAvLgkyDXHQbHEsIAUjCw8tCJ10zXOTABpOhsEoQHu/Lgk9dKwADy4JPtVeLSAAHAAJFb4OvXLAgUIJFwlgHXLAgcEuJSELHjDyDXShITFACWAfpAAfpE+Cj6RDBYuvLgke1E0IEBQdcY9AUEnX/IygBABIMH9FPy4IuOFAODB/Rb8uCMItcKACFuAbOw8tCQ4shQA88WEvQAye1UAHIw1ywIJI4tIfLgktIA7UTQ0gBRE7ry0I9UUDCRMZwBgQFA1yHXCgDy4I7iyMoAWM8Wye1Uk/LAjeIAEJNb2zHh10zQAFGAAAAAP///iNmRmWSQOOp5PpbMN/y9nTAOgPToezNPvCY051sAxg72oEU1tz4=',
  })
  @IsString()
  stateInit!: string;
}

export class CheckProofRequestDto {
  @ApiProperty({
    example:
      '0:605893d6874139ae5cf8ca022a6b63ad9594ce704dd472d356db1be650ee090a',
  })
  @IsString()
  address!: string;

  @ApiProperty({
    example: 'b32332c92071d4f27d2d986ff97b3a601d01e9d0f6669f784c69ceb6018c1ded',
  })
  @IsString()
  publicKey!: string;

  @ApiProperty({ type: TonProof })
  @Type(() => TonProof)
  @IsInstance(TonProof)
  proof!: TonProof;
}
