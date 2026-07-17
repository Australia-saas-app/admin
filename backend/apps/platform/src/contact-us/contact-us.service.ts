import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Not, In } from "typeorm";
import { Contact } from "../entities/contact.entity";

@Injectable()
export class ContactUsService {
  constructor(
    @InjectRepository(Contact)
    private contactRepository: Repository<Contact>,
  ) {}

  async submitContactForm(contactData: {
    name: string;
    email: string;
    subject?: string;
    message: string;
    phone?: string;
  }) {
    const contact = this.contactRepository.create({
      name: contactData.name,
      email: contactData.email,
      subject: contactData.subject,
      message: contactData.message,
      phone: contactData.phone,
      status: 'pending',
      isRead: false,
    });

    return await this.contactRepository.save(contact);
  }

  async findAll(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const [contacts, total] = await Promise.all([
      this.contactRepository.find({
        skip,
        take: limit,
        order: { createdAt: 'DESC' },
        relations: ['assignedUser'],
      }),
      this.contactRepository.count(),
    ]);

    return {
      data: contacts,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Contact> {
    const contact = await this.contactRepository.findOne({
      where: { id },
      relations: ['assignedUser'],
    });
    if (!contact) {
      throw new NotFoundException("Contact not found");
    }
    return contact;
  }

  async findByIds(ids: string[]): Promise<Contact[]> {
    if (!ids || ids.length === 0) {
      throw new BadRequestException("No IDs provided");
    }

    const contacts = await this.contactRepository.find({
      where: { id: In(ids) },
      relations: ['assignedUser'],
    });

    return contacts;
  }

  async update(
    id: string,
    updateContactDto: {
      status?: string;
      assignedTo?: string;
      metadata?: Record<string, any>;
      isRead?: boolean;
    }
  ) {
    const contact = await this.contactRepository.findOne({ where: { id } });
    if (!contact) {
      throw new NotFoundException("Contact not found");
    }

    // Update fields
    if (updateContactDto.status) contact.status = updateContactDto.status;
    if (updateContactDto.assignedTo) contact.assignedTo = updateContactDto.assignedTo;
    if (updateContactDto.metadata) contact.metadata = updateContactDto.metadata;
    if (updateContactDto.isRead !== undefined) contact.isRead = updateContactDto.isRead;

    return await this.contactRepository.save(contact);
  }

  async remove(id: string) {
    const contact = await this.contactRepository.findOne({ where: { id } });
    if (!contact) {
      throw new NotFoundException("Contact not found");
    }

    await this.contactRepository.remove(contact);
    return { message: "Contact deleted successfully" };
  }

  async deleteOne(id: string) {
    return await this.remove(id);
  }

  async deleteMany(ids?: string[]) {
    if (!ids || ids.length === 0) {
      throw new BadRequestException("No IDs provided for deletion");
    }

    const contacts = await this.contactRepository.find({
      where: { id: In(ids) },
    });

    if (contacts.length === 0) {
      throw new NotFoundException("No contacts found for the provided IDs");
    }

    await this.contactRepository.remove(contacts);
    return {
      message: `${contacts.length} contacts deleted successfully`,
      deletedCount: contacts.length
    };
  }

  async findByStatus(status: string) {
    return await this.contactRepository.find({
      where: { status },
      order: { createdAt: 'DESC' },
    });
  }

  async markAsRead(id: string) {
    const contact = await this.contactRepository.findOne({ where: { id } });
    if (!contact) {
      throw new NotFoundException("Contact not found");
    }

    contact.isRead = true;
    return await this.contactRepository.save(contact);
  }

  async getUnreadCount() {
    return await this.contactRepository.count({ where: { isRead: false } });
  }

  async search(name: string): Promise<Contact[]> {
    return this.contactRepository
      .createQueryBuilder("contact")
      .where("contact.name ILIKE :name", { name: `%${name}%` })
      .orderBy("contact.createdAt", "DESC")
      .getMany();
  }
}