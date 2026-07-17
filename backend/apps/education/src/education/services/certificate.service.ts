import { Injectable, NotFoundException, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Certificate } from "../entities/certificate.entity";
import { Enrollment } from "../entities/enrollment.entity";

@Injectable()
export class CertificateService {
  private readonly logger = new Logger(CertificateService.name);

  constructor(
    @InjectRepository(Certificate)
    private readonly certificateRepository: Repository<Certificate>,
    @InjectRepository(Enrollment)
    private readonly enrollmentRepository: Repository<Enrollment>,
  ) {}

  async findAll(enrollmentId?: string) {
    const where: any = {};

    if (enrollmentId) {
      const enrollment = await this.enrollmentRepository.findOne({
        where: { enrollmentId },
      });
      if (!enrollment) {
        throw new NotFoundException(
          `Enrollment with ID ${enrollmentId} not found`,
        );
      }
      where.enrollmentId = enrollment.id;
    }

    const certificates = await this.certificateRepository.find({
      where,
      relations: ["enrollment", "enrollment.course"],
      order: { issuedAt: "DESC" },
    });

    return certificates;
  }

  async findOne(certificateId: string): Promise<Certificate> {
    const certificate = await this.certificateRepository.findOne({
      where: { certificateId },
      relations: ["enrollment", "enrollment.course"],
    });

    if (!certificate) {
      throw new NotFoundException(
        `Certificate with ID ${certificateId} not found`,
      );
    }

    return certificate;
  }

  async remove(certificateId: string): Promise<void> {
    const certificate = await this.certificateRepository.findOne({
      where: { certificateId },
    });

    if (!certificate) {
      throw new NotFoundException(
        `Certificate with ID ${certificateId} not found`,
      );
    }

    await this.certificateRepository.remove(certificate);
  }
}
